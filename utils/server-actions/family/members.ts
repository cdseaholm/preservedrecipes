'use server'

import { revalidatePath } from "next/cache";
import Family from "@/models/family";
import Invite from "@/models/invite";
import User from "@/models/user";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { getAuthenticatedFamilyContext, getRevalidationPath, hasAdminPrivilege, verifyUserPassword } from "./utils";

function normalizeMemberKey(key: string) {
    return key.trim().toLowerCase();
}

function memberKey(member: IFamilyMember) {
    return normalizeMemberKey(member.familyMemberID || member.familyMemberEmail);
}

export async function RemoveFamilyMembers(familyId: string, memberIds: string[], adminPassword: string, route: string) {
    if (!memberIds?.length) {
        return { success: false, message: "No members selected", members: [] as IFamilyMember[] };
    }

    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family) return { success: false, message, members: [] as IFamilyMember[] };
    if (!hasAdminPrivilege(member)) return { success: false, message: "Admin privileges are required", members: [] as IFamilyMember[] };
    if (!(await verifyUserPassword(user, adminPassword))) return { success: false, message: "Password is incorrect", members: [] as IFamilyMember[] };

    const uniqueMemberIds = Array.from(new Set(memberIds.map(normalizeMemberKey).filter(Boolean)));
    const existingIds = new Set(family.familyMembers.map(memberKey));

    if (uniqueMemberIds.some(memberId => !existingIds.has(memberId))) {
        return { success: false, message: "One or more members do not belong to this family", members: family.familyMembers };
    }

    const membersToRemove = family.familyMembers.filter(familyMember => uniqueMemberIds.includes(memberKey(familyMember)));
    const remainingMembers = family.familyMembers.filter(familyMember => !uniqueMemberIds.includes(memberKey(familyMember)));
    if (remainingMembers.length === 0) {
        return { success: false, message: "A family must have at least one member", members: family.familyMembers };
    }

    if (!remainingMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
        return { success: false, message: "At least one admin is required", members: family.familyMembers };
    }

    try {
        const connectedMemberIds = membersToRemove
            .map(familyMember => familyMember.familyMemberID)
            .filter(Boolean);
        const invitedEmails = membersToRemove
            .filter(familyMember => !familyMember.memberConnected)
            .map(familyMember => familyMember.familyMemberEmail.trim().toLowerCase())
            .filter(Boolean);

        await Family.updateOne({ _id: family._id }, { $set: { familyMembers: remainingMembers } });
        if (connectedMemberIds.length > 0) {
            await User.updateMany({ _id: { $in: connectedMemberIds } }, { $set: { userFamilyID: "" } });
        }
        if (invitedEmails.length > 0) {
            await Invite.deleteMany({ inviteType: 'family', familyID: familyId, email: { $in: invitedEmails } });
        }
        revalidatePath(getRevalidationPath(route, `/family/${familyId}/members`));

        return { success: true, message: "Members removed successfully", members: remainingMembers };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to remove members", members: [] as IFamilyMember[] };
    }
}

export async function LeaveFamily(familyId: string, route = "/") {
    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family || !member) return { success: false, message };

    const remainingMembers = family.familyMembers.filter(familyMember => familyMember !== member);
    if (member.permissionStatus === "Admin" && !remainingMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
        return { success: false, message: "Assign another admin before leaving this family" };
    }

    try {
        await Family.updateOne({ _id: family._id }, { $set: { familyMembers: remainingMembers } });
        await User.updateOne({ _id: user._id }, { $set: { userFamilyID: "" } });
        revalidatePath(getRevalidationPath(route, "/"));

        return { success: true, message: "Successfully left family" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to leave family" };
    }
}

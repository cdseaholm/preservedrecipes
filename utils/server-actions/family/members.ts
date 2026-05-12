'use server'

import { revalidatePath } from "next/cache";
import Family from "@/models/family";
import User from "@/models/user";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { getAuthenticatedFamilyContext, getRevalidationPath, hasAdminPrivilege } from "./utils";

export async function RemoveFamilyMembers(familyId: string, memberIds: string[], route: string) {
    if (!memberIds?.length) {
        return { success: false, message: "No members selected", members: [] as IFamilyMember[] };
    }

    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family) return { success: false, message, members: [] as IFamilyMember[] };
    if (!hasAdminPrivilege(member)) return { success: false, message: "Admin privileges are required", members: [] as IFamilyMember[] };

    const uniqueMemberIds = Array.from(new Set(memberIds));
    const existingIds = new Set(family.familyMembers.map(familyMember => familyMember.familyMemberID));

    if (uniqueMemberIds.some(memberId => !existingIds.has(memberId))) {
        return { success: false, message: "One or more members do not belong to this family", members: family.familyMembers };
    }

    const remainingMembers = family.familyMembers.filter(familyMember => !uniqueMemberIds.includes(familyMember.familyMemberID));
    if (remainingMembers.length === 0) {
        return { success: false, message: "A family must have at least one member", members: family.familyMembers };
    }

    if (!remainingMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
        return { success: false, message: "At least one admin is required", members: family.familyMembers };
    }

    try {
        await Family.updateOne({ _id: family._id }, { $set: { familyMembers: remainingMembers } });
        await User.updateMany({ _id: { $in: uniqueMemberIds } }, { $set: { userFamilyID: "" } });
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

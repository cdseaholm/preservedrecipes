'use server'

import { revalidatePath } from "next/cache";
import Family from "@/models/family";
import {
    getAuthenticatedFamilyContext,
    getRevalidationPath,
    hasAdminPrivilege,
    sanitizeFamilyMember,
    verifyUserPassword,
} from "./utils";
import { IFamilyMember } from "@/models/types/family/familyMember";

export async function UpdateFamilyName(familyId: string, newName: string, adminPassword: string, route: string) {
    if (!newName?.trim()) {
        return { success: false, message: "Family name is required" };
    }

    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family) return { success: false, message };
    if (!hasAdminPrivilege(member)) return { success: false, message: "Admin privileges are required" };
    if (!(await verifyUserPassword(user, adminPassword))) return { success: false, message: "Password is incorrect" };

    try {
        family.name = newName.trim();
        await family.save();
        revalidatePath(getRevalidationPath(route, `/family/${familyId}/settings`));
        return { success: true, message: "Family name updated successfully", family: JSON.parse(JSON.stringify(family)) };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update family name" };
    }
}

export async function UpdateFamilyMemberStatuses(familyId: string, membersToChange: IFamilyMember[], adminPassword: string, route: string) {
    if (!membersToChange?.length) {
        return { success: false, message: "No members selected", members: [] as IFamilyMember[] };
    }

    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family) return { success: false, message, members: [] as IFamilyMember[] };
    if (!hasAdminPrivilege(member)) return { success: false, message: "Admin privileges are required", members: [] as IFamilyMember[] };
    if (!(await verifyUserPassword(user, adminPassword))) return { success: false, message: "Password is incorrect", members: [] as IFamilyMember[] };

    try {
        const currentMembers = family.familyMembers.map(existing => sanitizeFamilyMember(existing as IFamilyMember));
        const changeById = new Map(membersToChange.map(changed => [changed.familyMemberID, sanitizeFamilyMember(changed)]));
        const updatedMembers = currentMembers.map(existing => {
            const changed = changeById.get(existing.familyMemberID);
            if (!changed) return existing;
            return {
                ...existing,
                permissionStatus: changed.permissionStatus,
            };
        }) as IFamilyMember[];

        if (!updatedMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
            return { success: false, message: "At least one admin is required", members: currentMembers };
        }

        const existingIds = new Set(currentMembers.map(familyMember => familyMember.familyMemberID));
        if (membersToChange.some(changed => !existingIds.has(changed.familyMemberID))) {
            return { success: false, message: "One or more members do not belong to this family", members: currentMembers };
        }

        await Family.updateOne({ _id: family._id }, { $set: { familyMembers: updatedMembers } });
        revalidatePath(getRevalidationPath(route, `/family/${familyId}/settings`));

        return { success: true, message: "Member statuses updated successfully", members: updatedMembers };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update member statuses", members: [] as IFamilyMember[] };
    }
}

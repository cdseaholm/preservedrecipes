'use server'

import { revalidatePath } from "next/cache";
import Family from "@/models/family";
import User from "@/models/user";
import { getAuthenticatedFamilyContext, getRevalidationPath, hasAdminPrivilege } from "./utils";

export async function DeleteFamily(familyId: string, route = "/") {
    const { user, family, member, message } = await getAuthenticatedFamilyContext(familyId);
    if (!user || !family) return { success: false, message };
    if (!hasAdminPrivilege(member)) return { success: false, message: "Admin privileges are required" };

    try {
        const familyMemberIds = family.familyMembers.map(familyMember => familyMember.familyMemberID);
        await User.updateMany({ _id: { $in: familyMemberIds } }, { $set: { userFamilyID: "" } });
        await Family.deleteOne({ _id: family._id });
        revalidatePath(getRevalidationPath(route, "/"));

        return { success: true, message: "Family deleted successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete family" };
    }
}

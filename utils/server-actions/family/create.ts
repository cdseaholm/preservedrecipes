'use server'

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import Family from "@/models/family";
import User from "@/models/user";
import { FamilyFormType } from "@/components/forms/family/familyForm";
import { IFamily } from "@/models/types/family/family";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { getServerSession } from "next-auth";
import { getRevalidationPath } from "./utils";

export async function CreateFamily(familyData: FamilyFormType, route = "/u/profile") {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: "Unauthorized", family: null };
    }

    if (!familyData?.name?.trim()) {
        return { success: false, message: "Family name is required", family: null };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, message: "User not found", family: null };
        }

        if (user.userFamilyID) {
            return { success: false, message: "You already belong to a family", family: null };
        }

        const initialMembers = [{
            familyMemberName: user.name,
            familyMemberEmail: user.email,
            familyMemberID: user._id.toString(),
            permissionStatus: "Admin",
            memberConnected: true,
        }] as IFamilyMember[];

        const insertedFamily = await Family.create({
            name: familyData.name.trim(),
            recipeIDs: [],
            familyMembers: initialMembers,
            heritage: familyData.heritage || [],
        }) as IFamily;

        await User.updateOne(
            { _id: user._id, userFamilyID: "" },
            { $set: { userFamilyID: insertedFamily._id.toString() } },
        );

        revalidatePath(getRevalidationPath(route, "/u/profile"));

        return { success: true, message: "Family created successfully", family: JSON.parse(JSON.stringify(insertedFamily)) as IFamily };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create family", family: null };
    }
}

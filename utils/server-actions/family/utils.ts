import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import Family from "@/models/family";
import User from "@/models/user";
import { IFamily } from "@/models/types/family/family";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IUser } from "@/models/types/personal/user";
import { VerifyPassword } from "@/utils/userHelpers/verifyPassword";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { normalizeEmail as normalizeSharedEmail, normalizeId as normalizeSharedId } from "@/lib/data-normalization";

export type FamilyActionResult<T = unknown> = {
    success: boolean;
    message: string;
} & T;

export function isValidId(id: string) {
    return Types.ObjectId.isValid(id);
}

export function getRevalidationPath(route: string, fallback = "/") {
    return route?.startsWith("/") ? route : fallback;
}

export function normalizeEmail(email: string) {
    return normalizeSharedEmail(email);
}

export function normalizeId(id: unknown) {
    return normalizeSharedId(id);
}

export function getFamilyMember(family: IFamily, user: IUser) {
    return family.familyMembers?.find(member =>
        normalizeId(member.familyMemberID) === normalizeId(user._id) || normalizeEmail(member.familyMemberEmail) === normalizeEmail(user.email)
    ) || null;
}

export function hasAdminPrivilege(member: IFamilyMember | null) {
    return member?.permissionStatus === "Admin";
}

export function hasConnectedMembership(member: IFamilyMember | null, user: IUser) {
    if (!member?.memberConnected) return false;

    return normalizeId(member.familyMemberID) === normalizeId(user._id) || normalizeEmail(member.familyMemberEmail) === normalizeEmail(user.email);
}

export async function getAuthenticatedFamilyContext(familyId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { user: null, family: null, member: null, message: "Unauthorized" };
    }

    if (!familyId || !isValidId(familyId)) {
        return { user: null, family: null, member: null, message: "Invalid family ID" };
    }

    const famIdString = normalizeId(familyId);

    await connectDB();

    const userDoc = await User.findOne({ email: normalizeEmail(session.user.email) });
    if (!userDoc) {
        return { user: null, family: null, member: null, message: "User not found" };
    }

    const familyDoc = await Family.findById(famIdString);
    if (!familyDoc) {
        return { user: userDoc as IUser, family: null, member: null, message: "Family not found" };
    }

    if (normalizeId((userDoc as IUser).userFamilyID) !== famIdString) {
        return { user: userDoc as IUser, family: null, member: null, message: "You do not belong to this family" };
    }

    const member = getFamilyMember(familyDoc as IFamily, userDoc as IUser);
    if (!hasConnectedMembership(member, userDoc as IUser)) {
        return { user: userDoc as IUser, family: null, member: null, message: "You do not belong to this family" };
    }

    return { user: userDoc, family: familyDoc, member, message: "" };
}

export async function verifyUserPassword(user: IUser, password: string | undefined) {
    if (!password) return false;
    return VerifyPassword(password, user.password);
}

export function sanitizeFamilyMember(member: IFamilyMember): IFamilyMember {
    return {
        familyMemberID: member.familyMemberID,
        familyMemberName: member.familyMemberName,
        familyMemberEmail: normalizeEmail(member.familyMemberEmail),
        permissionStatus: member.permissionStatus,
        memberConnected: Boolean(member.memberConnected),
    };
}

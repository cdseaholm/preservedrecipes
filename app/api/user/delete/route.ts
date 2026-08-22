import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Family from "@/models/family";
import Community from "@/models/community";
import Recipe from "@/models/recipe";
import { authOptions } from "@/lib/auth/auth-options";

function normalizeEmail(email: string | null | undefined) {
    return email?.trim().toLowerCase() ?? "";
}

function normalizeId(id: unknown) {
    if (!id) return "";
    return typeof id === "string" ? id : id.toString();
}

function response(body: { status: number; message: string; [key: string]: unknown }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function DELETE() {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return response({ status: 401, message: 'Unauthorized' }, 401);
    }

    const session = await getServerSession(authOptions)

    if (!session) {
        return response({ status: 401, message: 'Unauthorized' }, 401);
    }

    try {
        await connectDB();
        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
        if (email === '') {
            return response({ status: 401, message: 'Unauthorized' }, 401);
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return response({ status: 404, message: 'User not found' }, 404);
        }

        const userId = user._id.toString();
        const userEmail = normalizeEmail(user.email);
        const familyFilters: Record<string, unknown>[] = [
            { 'familyMembers.familyMemberID': userId },
            { 'familyMembers.familyMemberEmail': userEmail },
        ];

        if (user.userFamilyID && ObjectId.isValid(user.userFamilyID)) {
            familyFilters.push({ _id: new ObjectId(user.userFamilyID) });
        }

        const families = await Family.find({ $or: familyFilters });

        for (const family of families) {
            const members = family.familyMembers || [];
            const matchedMembers = members.filter(familyMember =>
                normalizeId(familyMember.familyMemberID) === userId ||
                normalizeEmail(familyMember.familyMemberEmail) === userEmail
            );

            if (!matchedMembers.length) continue;

            const remainingMembers = members.filter(familyMember =>
                normalizeId(familyMember.familyMemberID) !== userId &&
                normalizeEmail(familyMember.familyMemberEmail) !== userEmail
            );

            const removedAnAdmin = matchedMembers.some(familyMember => familyMember.permissionStatus === "Admin");
            if (removedAnAdmin && !remainingMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
                return response(
                    { status: 409, message: "Assign another admin before deleting your profile" },
                    409
                );
            }

            await Family.updateOne(
                { _id: family._id },
                { $set: { familyMembers: remainingMembers } }
            );
        }

        const communityObjectIds = (user.communityIDs || [])
            .filter(id => ObjectId.isValid(id))
            .map(id => new ObjectId(id));

        const communities = await Community.find({
            $or: [
                { creatorID: userId },
                { adminIDs: userId },
                { communityMemberIDs: userId },
                ...(communityObjectIds.length ? [{ _id: { $in: communityObjectIds } }] : []),
            ],
        });

        for (const community of communities) {
            const creatorId = normalizeId(community.creatorID);
            const adminIds = (community.adminIDs || []).map(normalizeId).filter(Boolean);
            const memberIds = (community.communityMemberIDs || []).map(normalizeId).filter(Boolean);
            const adminSet = new Set([creatorId, ...adminIds].filter(Boolean));
            const userIsAdmin = adminSet.has(userId);
            const remainingAdminIds = Array.from(adminSet).filter(id => id !== userId);

            if (userIsAdmin && remainingAdminIds.length === 0) {
                return response(
                    { status: 409, message: `Assign another admin in ${community.name} before deleting your profile` },
                    409
                );
            }

            const nextCreatorId = creatorId === userId ? remainingAdminIds[0] : creatorId;
            const nextAdminIds = Array.from(new Set(adminIds.filter(id => id !== userId)));
            const nextMemberIds = Array.from(new Set(memberIds.filter(id => id !== userId)));

            await Community.updateOne(
                { _id: community._id },
                {
                    $set: {
                        creatorID: nextCreatorId,
                        adminIDs: nextAdminIds,
                        communityMemberIDs: nextMemberIds,
                    },
                }
            );
        }

        await Promise.all([
            Recipe.updateMany(
                { creatorID: userId },
                { $set: { creatorID: '' }, $pull: { secretViewerIDs: { $in: [userId, normalizeEmail(user.email)] } } }
            ),
            Recipe.updateMany(
                { creatorID: { $ne: userId } },
                { $pull: { secretViewerIDs: { $in: [userId, normalizeEmail(user.email)] } } }
            ),
            MongoUser.updateMany(
                { _id: { $ne: new ObjectId(userId) } },
                {
                    $pull: {
                        savedRecipeIDs: { $in: user.recipeIDs || [] },
                        favoriteRecipeIDs: { $in: user.recipeIDs || [] },
                    },
                }
            ),
        ]);

        const deleteResult = await MongoUser.deleteOne({ _id: new ObjectId(userId), email: userEmail });

        if (deleteResult.deletedCount !== 1) {
            return response({ status: 500, message: 'Account deletion did not complete' }, 500);
        }

        return response({ status: 200, message: 'Success!' }, 200);

    } catch (error: any) {
        console.error('[user/delete] Failed', error);
        return response({ status: 500, message: 'Error deleting account' }, 500);
    }
}

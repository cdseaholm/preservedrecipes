import connectDB from "@/lib/mongodb";
import { getAuthedUser, sanitizeCommunityPayload } from "@/lib/community-utils";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });

    try {
        const body = await req.json();
        await connectDB();
        const community = sanitizeCommunityPayload(body.communityPassed as Partial<ICommunity>);

        if (!community.name || community.name.length < 3) {
            return NextResponse.json({ status: 400, message: 'Invalid community data', communityReturned: {} as ICommunity });
        }

        if (community.privacyLevel === 'passwordProtected' && !community.communityPassword) {
            return NextResponse.json({ status: 400, message: 'Password protected communities need a password', communityReturned: {} as ICommunity });
        }

        const userId = user._id.toString();

        if (!userId || userId === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });
        }

        const communityToAdd = {
            ...community,
            adminIDs: [userId],
            communityMemberIDs: [userId],
            creatorID: userId,
            postIDs: [],
            recipeIDs: [],
            requestIDs: [],
        };

        const insertedCommunity = await Community.create(communityToAdd);

        if (!insertedCommunity) {
            console.log("Error creating community");
            return NextResponse.json({ status: 500, message: 'Error creating community', communityReturned: {} as ICommunity });
        }

        await MongoUser.updateOne({ _id: userId }, { $addToSet: { communityIDs: insertedCommunity._id.toString() } });

        return NextResponse.json({ status: 200, message: 'Success!', communityReturned: insertedCommunity as ICommunity });

    } catch (error: any) {
        console.error('Error creating community:', error);
        return NextResponse.json({ status: 500, message: 'Error creating community', communityReturned: {} as ICommunity });
    }
}

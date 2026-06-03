import connectDB from "@/lib/mongodb";
import { getAuthedUser, isCommunityMember } from "@/lib/community-utils";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import { compare } from "bcrypt-ts";

export async function PUT(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        await connectDB();

        const communityID = body.communityID as string;

        if (!communityID || communityID === '') {
            return NextResponse.json({ status: 400, message: 'Invalid community data' });
        }

        const passwordSent = body.password as string;

        if (!passwordSent || passwordSent === '') {
            return NextResponse.json({ status: 400, message: 'Invalid password data' });
        }

        const community = await Community.findById(communityID) as ICommunity;

        if (!community) {
            return NextResponse.json({ status: 404, message: 'Community not found' });
        }

        if (community.privacyLevel !== 'passwordProtected') {
            return NextResponse.json({ status: 403, message: 'This community is not password protected' });
        }

        if (!community.communityPassword) {
            return NextResponse.json({ status: 500, message: 'Community password is not configured' });
        }

        const userId = user._id.toString();

        if (isCommunityMember(community, userId)) {
            return NextResponse.json({ status: 200, message: 'Already a member' });
        }

        const passwordMatch = await compare(passwordSent, community.communityPassword as string);

        if (!passwordMatch) {
            return NextResponse.json({ status: 403, message: 'Incorrect password' });
        }

        await Promise.all([
            MongoUser.updateOne({ _id: userId }, { $addToSet: { communityIDs: community._id.toString() } }),
            Community.updateOne({ _id: community._id }, { $addToSet: { communityMemberIDs: userId } }),
        ]);

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        console.error('Error joining password protected community:', error);
        return NextResponse.json({ status: 500, message: 'Error joining community' });
    }
}

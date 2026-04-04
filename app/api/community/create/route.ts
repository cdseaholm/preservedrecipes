import connectDB from "@/lib/mongodb";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', communityReturned: {} as ICommunity });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', communityReturned: {} as ICommunity });
        }

        const community = body.communityPassed as ICommunity;

        if (!community) {
            return NextResponse.json({ status: 400, message: 'Invalid community data', communityReturned: {} as ICommunity });
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
        } as ICommunity;

        const insertedCommunity = await Community.create(communityToAdd);

        if (!insertedCommunity) {
            console.log("Error creating community");
            return NextResponse.json({ status: 500, message: 'Error creating community', communityReturned: {} as ICommunity });
        }

        await MongoUser.updateOne({ email: email }, { $push: { communityIDs: insertedCommunity._id.toString() } });

        return NextResponse.json({ status: 200, message: 'Success!', communityReturned: insertedCommunity as ICommunity });

    } catch (error: any) {
        console.error('Error creating community:', error);
        return NextResponse.json({ status: 500, message: 'Error creating community', communityReturned: {} as ICommunity });
    }
}
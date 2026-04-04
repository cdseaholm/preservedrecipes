import connectDB from "@/lib/mongodb";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { getServerSession, User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import { compare } from "bcrypt-ts";

export async function PUT(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

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

        const passwordMatch = await compare(passwordSent, community.communityPassword as string);

        if (!passwordMatch) {
            return NextResponse.json({ status: 403, message: 'Incorrect password' });
        }

        await MongoUser.updateOne({ email: email }, { $push: { communityIDs: community._id.toString() } });
        await Community.updateOne({ _id: community._id }, { $push: { communityMemberIDs: user._id.toString() } });

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        console.error('Error creating community:', error);
        return NextResponse.json({ status: 500, message: 'Error creating community' });
    }
}
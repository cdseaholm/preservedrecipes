import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', communities: [] as ICommunity[] });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', communities: [] as ICommunity[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', communities: [] as ICommunity[] });
        }

        const communities = await Community.find({}) as ICommunity[];

        if (!communities || communities.length === 0) {
            return NextResponse.json({ status: 404, message: 'No communities found', communities: [] as ICommunity[] })
        }

        return NextResponse.json({ status: 200, message: 'Success!', communities: communities });
    } catch (error) {

        return NextResponse.json({ status: 500, message: 'Internal Server Error', communities: [] as ICommunity[] });
    }
}
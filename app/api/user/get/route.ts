import { connectDB } from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', userInfo: {} as IUser });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', userInfo: {} as IUser });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', userInfo: {} as IUser });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', userInfo: {} as IUser });
        }

        return NextResponse.json({ status: 200, message: 'Success!', userInfo: user });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error fetching', userInfo: {} as IUser });
    }
}
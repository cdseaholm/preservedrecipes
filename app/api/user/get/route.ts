import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function GET() {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', userInfo: {} as IUser });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', userInfo: {} as IUser });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
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

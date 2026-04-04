import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/inquiry";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { getServerSession, User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";

export async function POST(req: NextRequest) {

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

        const inquiry = body.inquiryPassed as IInquiry;

        const newInquiry = await Inquiry.create({
            inquirerEmail: inquiry.inquirerEmail,
            inquirerName: inquiry.inquirerName,
            inquiryType: inquiry.inquiryType,
            inquiryTitle: inquiry.inquiryTitle,
            inquiryMessage: inquiry.inquiryMessage,
            handled: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }) as IInquiry;

        if (!newInquiry) {
            return NextResponse.json({ status: 500, message: 'Error creating' });
        }

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating inquiry' });
    }
}
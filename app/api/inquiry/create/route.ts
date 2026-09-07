import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/inquiry";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import { normalizeAdminEmail } from "@/lib/admin";
import { authOptions } from "@/lib/auth/auth-options";
import { formatShortDate } from "@/lib/data-normalization";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        await connectDB();
        const email = normalizeAdminEmail(session.user.email);
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const inquiry = body.inquiryPassed as IInquiry;
        const inquiryType = inquiry.inquiryType;
        const inquiryTitle = inquiry.inquiryTitle || `${inquiryType} ${formatShortDate(new Date())}`;

        const newInquiry = await Inquiry.create({
            inquirerEmail: normalizeAdminEmail(user.email),
            inquirerName: user.name || user.email,
            inquiryType,
            inquiryTitle,
            inquiryMessage: inquiry.inquiryMessage,
            adminNote: '',
            read: false,
            handled: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }) as IInquiry;

        if (!newInquiry) {
            return NextResponse.json({ status: 500, message: 'Error creating' });
        }

        return NextResponse.json({ status: 200, message: 'Success!', returnedInquiry: newInquiry as IInquiry });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating inquiry' });
    }
}

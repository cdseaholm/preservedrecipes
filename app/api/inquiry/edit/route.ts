import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/inquiry";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { getServerSession, User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";

export async function PUT(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', inquiriesReturned: null });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
        }

        const inquiries = body.inquiriesToEdit as IInquiry[];

        if (!inquiries || inquiries.length === 0 || !inquiries[0]._id) {
            return NextResponse.json({ status: 500, message: 'Error updating inquiry', inquiriesReturned: null });
        }

        for (const inq of inquiries) {
            await Inquiry.findByIdAndUpdate(inq._id, {
                inquirerEmail: inq.inquirerEmail,
                inquirerName: inq.inquirerName,
                inquiryType: inq.inquiryType,
                inquiryTitle: inq.inquiryTitle,
                inquiryMessage: inq.inquiryMessage,
                handled: inq.handled,
                createdAt: inq.createdAt,
                updatedAt: new Date()
            }) as IInquiry;
        }

        const updatedInquiries = await Inquiry.find({}) as IInquiry[];

        if (!updatedInquiries || updatedInquiries.length === 0) {
            return NextResponse.json({ status: 500, message: 'Error updating inquiry', inquiriesReturned: null });
        }

        return NextResponse.json({ status: 200, message: 'Success!', inquiriesReturned: updatedInquiries as IInquiry[] });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error updating inquiry', inquiriesReturned: null });
    }
}
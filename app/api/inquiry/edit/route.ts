import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/inquiry";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import { isInquiryAdminEmail, normalizeAdminEmail } from "@/lib/admin";
import { authOptions } from "@/lib/auth/auth-options";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
    }

    try {
        const body = await req.json();
        await connectDB();
        const email = normalizeAdminEmail(session.user.email);
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', inquiriesReturned: null });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', inquiriesReturned: null });
        }

        if (!isInquiryAdminEmail(user.email)) {
            return NextResponse.json({ status: 403, message: 'Admin privileges are required', inquiriesReturned: null });
        }

        const inquiries = body.inquiriesToEdit as IInquiry[];

        if (!inquiries || inquiries.length === 0 || !inquiries[0]._id) {
            return NextResponse.json({ status: 500, message: 'Error updating inquiry', inquiriesReturned: null });
        }

        for (const inq of inquiries) {
            await Inquiry.findByIdAndUpdate(inq._id, {
                handled: inq.handled,
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

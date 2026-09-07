import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/inquiry";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import { isInquiryAdminEmail, normalizeAdminEmail } from "@/lib/admin";
import { authOptions } from "@/lib/auth/auth-options";

export async function DELETE(req: NextRequest) {
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

        const inquiries = body.itemsToDelete as IInquiry[];

        if (!inquiries || inquiries.length === 0 || !inquiries[0]._id) {
            return NextResponse.json({ status: 500, message: 'Error deleting inquiry' });
        }

        const idsToDelete = inquiries.map(inq => inq._id);
        const isAdmin = isInquiryAdminEmail(user.email);

        await Inquiry.deleteMany({
            _id: { $in: idsToDelete },
            ...(isAdmin ? {} : { inquirerEmail: email })
        });

        return NextResponse.json({ status: 200, message: 'Successfully deleted!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error deleting inquiry' });
    }
}

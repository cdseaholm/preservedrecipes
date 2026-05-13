import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import MongoUser from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
import Inquiry from '@/models/inquiry';
import { IInquiry } from '@/models/types/misc/inquiry';
import { IUser } from '@/models/types/personal/user';
import { normalizeAdminEmail } from '@/lib/admin';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from session.', inquirys: [] as IInquiry[] });
        }

        const userSesh = session.user as IUser;

        const headers = req.headers;
        if (!headers) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from headers', inquirys: [] as IInquiry[] });
        }

        await connectDB();
        const email = normalizeAdminEmail(userSesh.email || '');
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized via email', inquirys: [] as IInquiry[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', inquirys: [] as IInquiry[] });
        }

        const returnInquirys = await Inquiry.find({}) as IInquiry[];

        if (!returnInquirys || returnInquirys.length === 0) {
            return NextResponse.json({ status: 403, message: 'No Inquirys found', inquirys: [] as IInquiry[] });
        }

        return NextResponse.json({ status: 200, message: 'Success!', inquirys: returnInquirys });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: `Try catch err ${error}`, inquirys: [] as IInquiry[] });
    }
}

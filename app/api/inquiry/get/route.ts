import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import MongoUser from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
import Inquiry from '@/models/inquiry';
import { IInquiry } from '@/models/types/misc/inquiry';
import { IUser } from '@/models/types/personal/user';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!session) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from session.', inquirys: [] as IInquiry[] });
        }

        const userSesh = session.user as IUser;

        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from token', inquirys: [] as IInquiry[] });
        }

        const headers = req.headers;
        if (!headers) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from headers', inquirys: [] as IInquiry[] });
        }

        await connectDB();
        const email = userSesh.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized via email', inquirys: [] as IInquiry[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', inquirys: [] as IInquiry[] });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized via token mismatch', inquirys: [] as IInquiry[] });
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
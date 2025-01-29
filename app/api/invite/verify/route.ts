import { NextRequest, NextResponse } from 'next/server';
import Invite from '@/models/invite';
import connectDB from "@/lib/mongodb";
import { IInvite } from '@/models/types/invite';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json({ status: 400, message: 'Invalid token' });
        }

        const invite = await Invite.findOne({ token }) as IInvite;

        if (!invite) {
            return NextResponse.json({ status: 400, message: 'Invalid or expired invite token' });
        }

        // Check if the token has expired (older than 24 hours)
        const now = new Date();
        const createdAt = new Date(invite.createdAt);
        const hoursDifference = Math.abs(now.getTime() - createdAt.getTime()) / 36e5;

        if (hoursDifference > 24) {
            return NextResponse.json({ status: 400, message: 'Expired invite token' });
        }

        return NextResponse.redirect(`/register?token=${token}`);
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal server error' });
    }
}
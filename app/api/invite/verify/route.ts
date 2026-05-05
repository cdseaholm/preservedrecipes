import { NextRequest, NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import { findValidInviteByToken } from '@/lib/invite-utils';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json({ status: 400, message: 'Invalid token' });
        }

        const { invite, message } = await findValidInviteByToken(token);

        if (!invite) {
            return NextResponse.json({ status: 400, message });
        }

        return NextResponse.redirect(new URL(`/invite?token=${token}`, req.url));
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal server error' });
    }
}

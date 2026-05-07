import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeInviteEmail, removePendingInviteMember } from "@/lib/invite-utils";
import Invite from "@/models/invite";
import { IInvite } from "@/models/types/misc/invite";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function inviteResponse(body: { status: number; message: string }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.NEXTAUTH_SECRET || '';

        if (!secret) {
            return inviteResponse({ status: 401, message: 'Incorrect secret' });
        }

        const session = await getServerSession(authOptions);
        const token = await getToken({ req, secret });

        if (!session || !token) {
            return inviteResponse({ status: 401, message: 'Unauthorized' });
        }

        const email = normalizeInviteEmail(session.user?.email);
        if (!email) {
            return inviteResponse({ status: 401, message: 'Unauthorized' });
        }

        const body = await req.json();
        const inviteToken = typeof body.token === 'string' ? body.token : '';

        if (!inviteToken) {
            return inviteResponse({ status: 400, message: 'Invite token is required' });
        }

        await connectDB();

        const invite = await Invite.findOne({ token: inviteToken }) as IInvite | null;

        if (!invite) {
            return inviteResponse({ status: 404, message: 'Invite not found' });
        }

        if (normalizeInviteEmail(invite.email) !== email) {
            return inviteResponse({ status: 403, message: 'Sign in as the invited user to decline this invite' });
        }

        await removePendingInviteMember(invite);
        await Invite.deleteOne({ token: invite.token });

        return inviteResponse({ status: 200, message: 'Invite declined' });
    } catch (error) {
        console.error('Invite decline error:', error);
        return inviteResponse({ status: 500, message: 'Failed to decline invite' });
    }
}

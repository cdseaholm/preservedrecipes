import { authOptions } from "@/lib/auth/auth-options";
import { normalizeInviteEmail } from "@/lib/invite-utils";
import connectDB from "@/lib/mongodb";
import Invite from "@/models/invite";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function response(body: { status: number; message: string }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return response({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        const tokens = Array.isArray(body.tokens)
            ? body.tokens.filter((token: unknown): token is string => typeof token === 'string' && token.length > 0)
            : [];

        if (tokens.length === 0) {
            return response({ status: 400, message: 'No invites selected' });
        }

        await connectDB();

        const email = normalizeInviteEmail(session.user.email);
        if (!email) {
            return response({ status: 401, message: 'Unauthorized' });
        }

        await Invite.updateMany(
            { token: { $in: tokens }, email },
            { read: Boolean(body.read), updatedAt: new Date() }
        );

        return response({ status: 200, message: 'Invites updated' });
    } catch (error) {
        console.error('[invite/edit] Failed', error);
        return response({ status: 500, message: 'Failed to update invites' });
    }
}

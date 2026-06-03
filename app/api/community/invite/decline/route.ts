import { getAuthedUser } from "@/lib/community-utils";
import { normalizeInviteEmail } from "@/lib/invite-utils";
import Invite from "@/models/invite";
import { IInvite } from "@/models/types/misc/invite";
import { NextRequest, NextResponse } from "next/server";

function response(body: { status: number; message: string }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || response({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        const token = typeof body.token === 'string' ? body.token : '';
        if (!token) {
            return response({ status: 400, message: 'Invite token is required' });
        }

        const invite = await Invite.findOne({ token }) as IInvite | null;
        if (!invite) {
            return response({ status: 404, message: 'Invite not found' });
        }

        if ((invite.inviteType || 'family') !== 'community') {
            return response({ status: 400, message: 'This is not a community invite' });
        }

        if (normalizeInviteEmail(invite.email) !== normalizeInviteEmail(user.email)) {
            return response({ status: 403, message: 'Sign in as the invited user to decline this invite' });
        }

        await Invite.deleteOne({ token: invite.token });

        return response({ status: 200, message: 'Invite declined' });
    } catch (routeError) {
        console.error('[community/invite/decline] Failed', routeError);
        return response({ status: 500, message: 'Failed to decline community invite' });
    }
}

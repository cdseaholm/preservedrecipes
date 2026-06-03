import { getAuthedUser, getCommunityById, isCommunityMember } from "@/lib/community-utils";
import { findValidInviteByToken, normalizeInviteEmail } from "@/lib/invite-utils";
import Community from "@/models/community";
import Invite from "@/models/invite";
import { ICommunity } from "@/models/types/community/community";
import MongoUser from "@/models/user";
import { ObjectId } from "mongodb";
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

        const { invite, message } = await findValidInviteByToken(token);
        if (!invite) {
            return response({ status: 404, message });
        }

        if ((invite.inviteType || 'family') !== 'community') {
            return response({ status: 400, message: 'This is not a community invite' });
        }

        const email = normalizeInviteEmail(user.email);
        if (!email || email !== normalizeInviteEmail(invite.email)) {
            return response({ status: 403, message: 'Sign in as the invited user to accept this invite' });
        }

        if (!invite.communityID || !ObjectId.isValid(invite.communityID)) {
            return response({ status: 400, message: 'Invalid community invite' });
        }

        const community = await getCommunityById(invite.communityID) as ICommunity | null;
        if (!community) {
            await Invite.deleteOne({ token: invite.token });
            return response({ status: 404, message: 'Community not found' });
        }

        const userId = user._id.toString();
        if (isCommunityMember(community, userId)) {
            await Invite.deleteOne({ token: invite.token });
            return response({ status: 200, message: 'Invite already accepted' });
        }

        await Promise.all([
            Community.updateOne({ _id: community._id }, { $addToSet: { communityMemberIDs: userId } }),
            MongoUser.updateOne({ _id: userId }, { $addToSet: { communityIDs: community._id.toString() } }),
            Invite.deleteOne({ token: invite.token }),
        ]);

        return response({ status: 200, message: `Joined ${community.name}` });
    } catch (routeError) {
        console.error('[community/invite/accept] Failed', routeError);
        return response({ status: 500, message: 'Failed to accept community invite' });
    }
}

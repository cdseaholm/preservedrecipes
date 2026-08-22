import CommunityInviteTemplate from "@/emails/community-invite-template-email";
import { getAuthedUser, getCommunityById, isCommunityAdmin, isCommunityMember } from "@/lib/community-utils";
import { normalizeInviteEmail } from "@/lib/invite-utils";
import Invite from "@/models/invite";
import { ICommunity } from "@/models/types/community/community";
import { IInvite } from "@/models/types/misc/invite";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const unverifiedConsumerDomains = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']);
const productionInviteUrl = 'https://www.getrecipesafe.com';

function response(body: { status: number; message: string; invitesReturned?: IInvite[] }, status = body.status) {
    return NextResponse.json(body, { status });
}

function getInviteBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_BASE_URL || productionInviteUrl;
    }

    return process.env.NEXT_PUBLIC_INVITE_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || productionInviteUrl;
}

function getInviteSender(emailFrom: string) {
    const fromDomain = emailFrom.split('@')[1]?.toLowerCase() || '';

    if (unverifiedConsumerDomains.has(fromDomain)) {
        return {
            error: `EMAIL_FROM uses ${fromDomain}, but Resend requires a verified sender domain. Use an address from a domain verified in Resend.`,
            from: '',
        };
    }

    return { error: '', from: emailFrom };
}

export async function POST(req: NextRequest) {
    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || response({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        const communityID = typeof body.communityID === 'string' ? body.communityID : '';
        const rawEmails = (Array.isArray(body.emails) ? body.emails : [body.email]) as unknown[];
        const emails = Array.from(new Set(
            rawEmails
                .map((email: unknown) => normalizeInviteEmail(typeof email === 'string' ? email : ''))
                .filter(email => email && /^\S+@\S+\.\S+$/.test(email))
        )).slice(0, 20);

        if (!ObjectId.isValid(communityID)) {
            return response({ status: 400, message: 'Invalid community id' });
        }

        if (emails.length <= 0) {
            return response({ status: 400, message: 'Add at least one valid email' });
        }

        const community = await getCommunityById(communityID) as ICommunity | null;
        if (!community) {
            return response({ status: 404, message: 'Community not found' });
        }

        if (!isCommunityAdmin(community, user._id.toString())) {
            return response({ status: 403, message: 'Admin privileges required' });
        }

        const existingUsers = await MongoUser.find({ email: { $in: emails } }) as IUser[];
        const existingUsersByEmail = new Map(existingUsers.map(foundUser => [normalizeInviteEmail(foundUser.email), foundUser]));
        const existingPending = await Invite.find({
            inviteType: 'community',
            communityID,
            email: { $in: emails },
        }) as IInvite[];
        const pendingEmailSet = new Set(existingPending.map(invite => normalizeInviteEmail(invite.email)));

        const invitesToCreate = emails.filter(email => {
            const existingUser = existingUsersByEmail.get(email);
            if (existingUser && isCommunityMember(community, existingUser._id.toString())) return false;
            return !pendingEmailSet.has(email);
        });

        if (invitesToCreate.length <= 0) {
            return response({ status: 409, message: 'No new invites to send. These emails may already be members or already have pending invites.' });
        }

        const createdInvites = await Invite.insertMany(invitesToCreate.map(email => ({
            email,
            inviteType: 'community',
            familyID: '',
            communityID,
            token: crypto.randomBytes(20).toString('hex'),
        }))) as IInvite[];

        const emailFrom = process.env.EMAIL_FROM || '';
        const resendKey = process.env.RESEND_API_KEY || '';
        const baseUrl = getInviteBaseUrl();

        if (!emailFrom || !resendKey || !baseUrl) {
            return response({ status: 200, message: 'Invites created. Email is not configured, so invitees will see them in their profile inbox after signing in.', invitesReturned: createdInvites });
        }

        const sender = getInviteSender(emailFrom);
        if (sender.error) {
            return response({ status: 200, message: `Invites created. ${sender.error}`, invitesReturned: createdInvites });
        }

        const resend = new Resend(resendKey);
        for (const invite of createdInvites) {
            const sent: any = await resend.emails.send({
                from: `RecipeSafe <${sender.from}>`,
                to: invite.email,
                subject: `Invitation to join ${community.name}`,
                react: CommunityInviteTemplate({
                    senderName: user.name,
                    communityName: community.name,
                    profileLink: `${baseUrl}/u/profile?tab=inbox`,
                    firstName: invite.email.split('@')[0],
                }),
            }).catch((sendError: unknown) => {
                console.error('[community/invite/send] Email send failed', sendError);
                return null;
            });

            if (sent?.error) {
                console.error('[community/invite/send] Resend returned an error', sent.error);
            }
        }

        return response({ status: 200, message: 'Invites sent', invitesReturned: createdInvites });
    } catch (routeError) {
        console.error('[community/invite/send] Failed', routeError);
        return response({ status: 500, message: 'Failed to send community invites' });
    }
}

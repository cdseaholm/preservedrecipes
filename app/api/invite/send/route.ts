
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IUser } from '@/models/types/personal/user';
import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import connectDB from "@/lib/mongodb";
import Invite from '@/models/invite';
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";
import { NewFamMemFormType, NewMembers } from "@/models/types/family/new-fam";
import { IInvite } from "@/models/types/misc/invite";
import { ObjectId } from "mongodb";
import MongoUser from "@/models/user";
import InviteTemplate from "@/emails/invite-template-email";
import { authOptions } from "@/lib/auth/auth-options";
import { isInviteExpired, normalizeInviteEmail, removePendingInviteMember } from "@/lib/invite-utils";

type ItemType = { newMember: IFamilyMember, newToken: string };
const allowedPermissions = new Set(['Guest', 'Member', 'Admin']);
const inviteResponse = (body: { status: number, message: string, famMembersReturned: IFamilyMember[] }, status = body.status) =>
    NextResponse.json(body, { status });
const inviteErrorMessage = (fallback: string, error: unknown) =>
    error instanceof Error && error.message ? `${fallback}: ${error.message}` : fallback;
const inviteServerError = (message: string, error?: unknown) => {
    console.error(`[invite/send] ${message}`, error ?? '');
    return inviteResponse({
        status: 500,
        message: inviteErrorMessage(message, error),
        famMembersReturned: [] as IFamilyMember[],
    });
};
const unverifiedConsumerDomains = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']);
const productionInviteUrl = 'https://www.getrecipesafe.com';

function getInviteBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_BASE_URL || productionInviteUrl;
    }

    return process.env.NEXT_PUBLIC_INVITE_BASE_URL || productionInviteUrl;
}

function getInviteSender(emailFrom: string) {
    const fromDomain = emailFrom.split('@')[1]?.toLowerCase() || '';

    if (unverifiedConsumerDomains.has(fromDomain)) {
        return {
            error: `EMAIL_FROM uses ${fromDomain}, but Resend requires a verified sender domain. Use an address from a domain verified in Resend.`,
            from: '',
        };
    }

    return {
        error: '',
        from: emailFrom,
    };
}

async function prepareInvite({ email, familyID, inviteTokenCreated, futureFamilyMem }: { email: NewMembers, familyID: string, inviteTokenCreated: string, futureFamilyMem: IUser | null }) {
    const normalizedEmail = normalizeInviteEmail(email.email);

    const thisInvite = await Invite.create({
        email: normalizedEmail,
        familyID: familyID,
        token: inviteTokenCreated,
    }) as IInvite;

    if (!thisInvite) {
        throw new Error('Error creating invite');
    }

    if (futureFamilyMem) {

        const newMember = {
            familyMemberName: '',
            familyMemberEmail: futureFamilyMem.email,
            familyMemberID: futureFamilyMem._id.toString(),
            permissionStatus: email.permissions,
            memberConnected: false
        } as IFamilyMember;

        const inviteToken = inviteTokenCreated;
        return { newMember, inviteToken };
    } else {

        const newMember = {
            familyMemberName: '',
            familyMemberEmail: normalizedEmail,
            familyMemberID: '',
            permissionStatus: email.permissions,
            memberConnected: false
        } as IFamilyMember;

        const inviteToken = inviteTokenCreated;
        return { newMember, inviteToken };
    }
}

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.NEXTAUTH_SECRET || '';

        if (!secret) {
            return inviteResponse({ status: 401, message: 'Incorrect secret', famMembersReturned: [] as IFamilyMember[] });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return inviteResponse({ status: 401, message: 'Unauthorized from session', famMembersReturned: [] as IFamilyMember[] });
        }

        const user = session.user;

        if (!user) {
            return inviteResponse({ status: 401, message: 'Unauthorized from user', famMembersReturned: [] as IFamilyMember[] });
        }

        const senderEmail = user.email;
        const senderName = user.name;

        if (!senderEmail || !senderName) {
            return inviteResponse({ status: 401, message: 'Unauthorized from email', famMembersReturned: [] as IFamilyMember[] });
        }

        const body = await req.json();
        await connectDB();
        const sendToEmails = body.emails as NewFamMemFormType;
        const familyID = body.familyId as string;

        if (!ObjectId.isValid(familyID)) {
            return inviteResponse({ status: 400, message: 'Invalid family id', famMembersReturned: [] as IFamilyMember[] });
        }

        const familyIdObject = new ObjectId(familyID);

        const thisFamily = await Family.findOne({ _id: familyIdObject }) as IFamily;
        const actingUser = await MongoUser.findOne({ email: senderEmail }) as IUser;

        if (!thisFamily) {
            return inviteResponse({ status: 403, message: 'No family found', famMembersReturned: [] as IFamilyMember[] });
        }

        if (!actingUser || actingUser.userFamilyID !== familyID) {
            return inviteResponse({ status: 403, message: 'Unauthorized family access', famMembersReturned: [] as IFamilyMember[] });
        }

        const actingMember = thisFamily.familyMembers.find(member =>
            member.familyMemberID === actingUser._id.toString() || member.familyMemberEmail === actingUser.email
        );

        if (actingMember?.permissionStatus !== 'Admin') {
            return inviteResponse({ status: 403, message: 'Admin privileges required', famMembersReturned: [] as IFamilyMember[] });
        }

        const prevMembersRaw = thisFamily.familyMembers as IFamilyMember[];
        const activePrevMembers: IFamilyMember[] = [];
        const pendingMemberEmails = prevMembersRaw
            .filter(member => !member.memberConnected)
            .map(member => normalizeInviteEmail(member.familyMemberEmail))
            .filter(Boolean);
        const pendingInvites = pendingMemberEmails.length > 0
            ? await Invite.find({ familyID, email: { $in: pendingMemberEmails } }) as IInvite[]
            : [];
        const pendingInvitesByEmail = new Map(pendingInvites.map(invite => [normalizeInviteEmail(invite.email), invite]));
        const expiredInviteTokens: string[] = [];

        for (const member of prevMembersRaw) {
            const memberEmail = normalizeInviteEmail(member.familyMemberEmail);
            if (member.memberConnected || !memberEmail) {
                activePrevMembers.push(member);
                continue;
            }

            const pendingInvite = pendingInvitesByEmail.get(memberEmail);
            if (pendingInvite && !isInviteExpired(pendingInvite)) {
                activePrevMembers.push(member);
                continue;
            }

            if (pendingInvite) {
                expiredInviteTokens.push(pendingInvite.token);
            }
        }

        if (expiredInviteTokens.length > 0) {
            const expiredInviteTokenSet = new Set(expiredInviteTokens);
            await Promise.all(
                pendingInvites
                    .filter(invite => expiredInviteTokenSet.has(invite.token))
                    .map(invite => removePendingInviteMember(invite))
            );
            await Invite.deleteMany({ token: { $in: expiredInviteTokens } });
        }

        const prevMembers = activePrevMembers;
        const newItems: ItemType[] = [];
        const existingEmails = new Set(prevMembers.map(member => normalizeInviteEmail(member.familyMemberEmail)));
        const queuedEmails = new Set<string>();
        const requestedInvites: NewMembers[] = [];

        for (const email of sendToEmails.newMembers) {
            const normalizedEmail = normalizeInviteEmail(email.email);
            if (!normalizedEmail || !/^\S+@\S+$/.test(normalizedEmail)) continue;
            if (!allowedPermissions.has(email.permissions)) continue;
            if (existingEmails.has(normalizedEmail) || queuedEmails.has(normalizedEmail)) continue;

            queuedEmails.add(normalizedEmail);
            requestedInvites.push({ ...email, email: normalizedEmail });
        }

        const requestedEmails = requestedInvites.map(email => email.email);
        const existingUsers = requestedEmails.length > 0
            ? await MongoUser.find({ email: { $in: requestedEmails } }) as IUser[]
            : [];
        const existingUsersByEmail = new Map(existingUsers.map(user => [normalizeInviteEmail(user.email), user]));

        for (const email of requestedInvites) {
            const normalizedEmail = normalizeInviteEmail(email.email);
            const existingUser = existingUsersByEmail.get(normalizedEmail) || null;
            if (existingUser?.userFamilyID && existingUser.userFamilyID !== familyID) continue;

            const inviteTokenCreated = crypto.randomBytes(20).toString('hex');
            try {
                const { newMember, inviteToken } = await prepareInvite({
                    email: { ...email, email: normalizedEmail },
                    familyID,
                    inviteTokenCreated,
                    futureFamilyMem: existingUser
                });
                newItems.push({ newMember: newMember, newToken: inviteToken });
            } catch (error: any) {
                console.error('Issue preparing invite for:', email.email, error);
            }
        }

        if (newItems.length <= 0) {
            return inviteResponse({ status: 409, message: 'No new invites to send. These emails may already be members, already have pending invites, or belong to users in another family.', famMembersReturned: prevMembers });
        }

        const emailFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM as string : '';
        const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY as string : '';
        const url = getInviteBaseUrl();

        if (emailFrom === '' || url === '') {
            const missingConfig = [
                !emailFrom && 'EMAIL_FROM',
                !url && 'NEXT_PUBLIC_BASE_URL',
            ].filter(Boolean).join(', ');
            return inviteServerError(`Issue with email setup. Missing: ${missingConfig}`);
        }

        const sender = getInviteSender(emailFrom);

        if (sender.error) {
            return inviteServerError(sender.error);
        }

        if (resendKey === '') {
            return inviteServerError('Issue with email setup. Missing: RESEND_API_KEY');
        }

        const resend = new Resend(resendKey);

        for (const item of newItems) {
            const sent: any = await resend.emails.send({
                    from: `RecipeSafe <${sender.from}>`,
                    to: item.newMember.familyMemberEmail,
                    subject: `Invitation from ${senderName}`,
                    react: InviteTemplate({
                        senderName,
                        familyName: thisFamily.name,
                        inviteLink: `${url}/invite?token=${item.newToken}`,
                        firstName: item.newMember.familyMemberEmail.split('@')[0],
                    }),
                })
                .catch(async (error: unknown) => {
                    await Invite.deleteMany({ token: { $in: newItems.map(newItem => newItem.newToken) } });
                    throw new Error(inviteErrorMessage(`Email send failed for ${item.newMember.familyMemberEmail}`, error));
                });

            if (sent?.error) {
                await Invite.deleteMany({ token: { $in: newItems.map(newItem => newItem.newToken) } });
                return inviteServerError(`Resend returned an error for ${item.newMember.familyMemberEmail}`, sent.error);
            }

            if (!sent?.data) {
                await Invite.deleteMany({ token: { $in: newItems.map(newItem => newItem.newToken) } });
                return inviteServerError(`Resend returned no data for ${item.newMember.familyMemberEmail}`, sent);
            }
        }

        const membersToAdd = newItems.map((item) => item.newMember) as IFamilyMember[];

        const membersFused = [
            ...prevMembers,
            ...membersToAdd
        ] as IFamilyMember[];

        const updateResult = await Family.updateOne({ _id: familyIdObject }, { familyMembers: membersFused });

        if (updateResult.matchedCount <= 0) {
            await Invite.deleteMany({ token: { $in: newItems.map(newItem => newItem.newToken) } });
            return inviteServerError('Invites sent, but family members could not be updated');
        }

        return inviteResponse({ status: 200, message: 'Success', famMembersReturned: membersFused });

    } catch (err) {
        return inviteServerError('Internal Server Error', err);
    }
}

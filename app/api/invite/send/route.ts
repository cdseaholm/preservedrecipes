
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IUser } from '@/models/types/personal/user';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
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

async function prepareInvite({ email, familyID, inviteTokenCreated }: { email: NewMembers, familyID: string, inviteTokenCreated: string }) {
    const normalizedEmail = normalizeInviteEmail(email.email);
    const futureFamilyMem = await MongoUser.findOne({ email: normalizedEmail }) as IUser;

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
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', famMembersReturned: [] as IFamilyMember[] });
    }

    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret });

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from session', famMembersReturned: [] as IFamilyMember[] });
    }

    if (!token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from token', famMembersReturned: [] as IFamilyMember[] });
    }

    const user = session.user;

    if (!user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from user', famMembersReturned: [] as IFamilyMember[] });
    }

    const senderEmail = user.email;
    const senderName = user.name;

    if (!senderEmail || !senderName) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from email', famMembersReturned: [] as IFamilyMember[] });
    }

    try {
        const body = await req.json();
        await connectDB();
        const sendToEmails = body.emails as NewFamMemFormType;
        const familyID = body.familyId as string;

        if (!ObjectId.isValid(familyID)) {
            return NextResponse.json({ status: 400, message: 'Invalid family id', famMembersReturned: [] as IFamilyMember[] });
        }

        const familyIdObject = new ObjectId(familyID);

        const thisFamily = await Family.findOne({ _id: familyIdObject }) as IFamily;
        const actingUser = await MongoUser.findOne({ email: senderEmail }) as IUser;

        if (!thisFamily) {
            return NextResponse.json({ status: 403, message: 'No family found' });
        }

        if (!actingUser || actingUser.userFamilyID !== familyID) {
            return NextResponse.json({ status: 403, message: 'Unauthorized family access', famMembersReturned: [] as IFamilyMember[] });
        }

        const actingMember = thisFamily.familyMembers.find(member =>
            member.familyMemberID === actingUser._id.toString() || member.familyMemberEmail === actingUser.email
        );

        if (actingMember?.permissionStatus !== 'Admin') {
            return NextResponse.json({ status: 403, message: 'Admin privileges required', famMembersReturned: [] as IFamilyMember[] });
        }

        const prevMembersRaw = thisFamily.familyMembers as IFamilyMember[];
        const activePrevMembers: IFamilyMember[] = [];

        for (const member of prevMembersRaw) {
            const memberEmail = normalizeInviteEmail(member.familyMemberEmail);
            if (member.memberConnected || !memberEmail) {
                activePrevMembers.push(member);
                continue;
            }

            const pendingInvite = await Invite.findOne({ familyID, email: memberEmail }) as IInvite | null;
            if (pendingInvite && !isInviteExpired(pendingInvite)) {
                activePrevMembers.push(member);
                continue;
            }

            if (pendingInvite) {
                await removePendingInviteMember(pendingInvite);
                await Invite.deleteOne({ token: pendingInvite.token });
            }
        }

        const prevMembers = activePrevMembers;
        const newItems: ItemType[] = [];
        const existingEmails = new Set(prevMembers.map(member => normalizeInviteEmail(member.familyMemberEmail)));
        const queuedEmails = new Set<string>();

        for (const email of sendToEmails.newMembers) {
            const normalizedEmail = normalizeInviteEmail(email.email);
            if (!normalizedEmail || !/^\S+@\S+$/.test(normalizedEmail)) continue;
            if (!allowedPermissions.has(email.permissions)) continue;
            if (existingEmails.has(normalizedEmail) || queuedEmails.has(normalizedEmail)) continue;

            const existingUser = await MongoUser.findOne({ email: normalizedEmail }) as IUser | null;
            if (existingUser?.userFamilyID && existingUser.userFamilyID !== familyID) continue;

            queuedEmails.add(normalizedEmail);
            const inviteTokenCreated = crypto.randomBytes(20).toString('hex');
            try {
                const { newMember, inviteToken } = await prepareInvite({
                    email: { ...email, email: normalizedEmail },
                    familyID,
                    inviteTokenCreated
                });
                newItems.push({ newMember: newMember, newToken: inviteToken });
            } catch (error: any) {
                console.log('Issue with: ', email.email, error.message);
            }
        }

        if (newItems.length <= 0) {
            return NextResponse.json({ status: 405, message: 'Issue with members', famMembersReturned: [] as IFamilyMember[] });
        }

        const emailFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM as string : '';
        const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY as string : '';
        const url = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

        if (emailFrom === '' || resendKey === '' || url === '') {
            return NextResponse.json({ status: 405, message: 'Issue with gmail setup', famMembersReturned: [] as IFamilyMember[] });
        }

        const resend = new Resend(resendKey);

        if (!resend) {
            return NextResponse.json({ status: 500, message: 'Resend not initialized', famMembersReturned: [] as IFamilyMember[] });
        }

        for (const item of newItems) {
            const sent: any = await resend.emails.send({
                from: `Preserved Recipes <${emailFrom}>`,
                to: item.newMember.familyMemberEmail,
                subject: `Invitation from ${senderName}`,
                react: InviteTemplate({ senderName, familyName: thisFamily.name, inviteLink: `${url}/invite?token=${item.newToken}`, firstName: item.newMember.familyMemberEmail.split('@')[0] }),
            });
            if (!sent || !sent.data) {
                await Invite.deleteOne({ token: item.newToken });
                return NextResponse.json({ status: 500, message: `Errors with ${item.newMember.familyMemberEmail}`, famMembersReturned: [] as IFamilyMember[] });
            }
            if (sent && sent.error != null) {
                await Invite.deleteOne({ token: item.newToken });
                return NextResponse.json({ status: 500, message: `Errors with ${item.newMember.familyMemberEmail} ${sent.error}`, famMembersReturned: [] as IFamilyMember[] });
            }
        }

        const membersToAdd = newItems.map((item) => item.newMember) as IFamilyMember[];

        const membersFused = [
            ...prevMembers,
            ...membersToAdd
        ] as IFamilyMember[];

        await Family.updateOne({ _id: familyIdObject }, { familyMembers: membersFused });

        return NextResponse.json({ status: 200, message: 'Success', famMembersReturned: membersFused });

    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500, message: 'Internal Server Error', famMembersReturned: [] as IFamilyMember[] });
    }
}

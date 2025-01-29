import { IUser } from '@/models/types/user';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import crypto from 'crypto';
import connectDB from "@/lib/mongodb";
import Invite from '@/models/invite';
import { IInvite } from '@/models/types/invite';
import Family from '@/models/family';
import { ObjectId } from 'mongodb';
import { IFamily } from '@/models/types/family';
import { IFamilyMember } from '@/models/types/familyMember';
import MongoUser from '@/models/user';
import { NewFamMemFormType, NewMembers } from '@/components/forms/addFamMemForm';

type ItemType = { newMember: IFamilyMember, newToken: string };

async function sendEmail({ email, inviteToken, senderName, senderEmail, family, apppw, emailFrom, url }: { email: string, inviteToken: string, senderName: string, senderEmail: string, family: IFamily, apppw: string, emailFrom: string, url: string }) {

    const inviteLink = `${url}/invite?token=${inviteToken}`;


    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailFrom,
            pass: apppw,
        },
    });

    const mailOptions: Mail.Options = {
        from: emailFrom,
        to: email,
        subject: `Invitation from ${senderName} (${senderEmail})`,
        text: `You've been invited to join the family ${family.name} on Preserved Recipes!\n\nClick the link to join: ${inviteLink}`,
    };

    return new Promise<string>((resolve, reject) => {
        transport.sendMail(mailOptions, (err) => {
            if (!err) {
                resolve('Email sent');
            } else {
                reject(err.message);
            }
        });
    });
}

async function prepareInvite({ email, familyID, inviteTokenCreated }: { email: NewMembers, familyID: string, inviteTokenCreated: string }) {
    const futureFamilyMem = await MongoUser.findOne({ email: email.email }) as IUser;

    const thisInvite = await Invite.create({
        email: email.email,
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
            familyMemberEmail: email.email,
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

    const session = await getServerSession();
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
        const familyIdObject = new ObjectId(familyID);

        const thisFamily = await Family.findOne({ _id: familyIdObject }) as IFamily;

        if (!thisFamily) {
            return NextResponse.json({ status: 403, message: 'No family found' });
        }

        const prevMembers = thisFamily.familyMembers as IFamilyMember[];
        const newItems: ItemType[] = [];

        for (const email of sendToEmails.newMembers) {
            const inviteTokenCreated = crypto.randomBytes(20).toString('hex');
            try {
                const { newMember, inviteToken } = await prepareInvite({ email, familyID, inviteTokenCreated });
                newItems.push({ newMember: newMember, newToken: inviteToken });
            } catch (error: any) {
                console.log('Issue with: ', email.email, error.message);
            }
        }

        if (newItems.length <= 0) {
            return NextResponse.json({ status: 405, message: 'Issue with members', famMembersReturned: [] as IFamilyMember[] });
        }

        const emailFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM as string : '';
        const apppw = process.env.G_APP_PW ? process.env.G_APP_PW as string : '';
        const url = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

        if (emailFrom === '' || apppw === '' || url === '') {
            return NextResponse.json({ status: 405, message: 'Issue with gmail setup', famMembersReturned: [] as IFamilyMember[] });;
        }

        for (const item of newItems) {
            await sendEmail({ email: item.newMember.familyMemberEmail, inviteToken: item.newToken, senderName, senderEmail, family: thisFamily, apppw: apppw, emailFrom: emailFrom, url: url });
        }

        const membersToAdd = newItems.map((item) => item.newMember) as IFamilyMember[];

        const membersFused = [
            ...prevMembers,
            ...membersToAdd
        ] as IFamilyMember[];

        await Family.updateOne({ _id: familyIdObject }, { familyMembers: membersFused });

        return NextResponse.json({ status: 200, message: 'Success', famMembersReturned: membersFused });

    } catch (err) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', famMembersReturned: [] as IFamilyMember[] });
    }
}
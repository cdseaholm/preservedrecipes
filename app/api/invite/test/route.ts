import { NewFamMemFormType } from "@/components/forms/addFamMemForm";
import { IFamilyMember } from "@/models/types/familyMember";
import { IUser } from '@/models/types/user';
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import connectDB from "@/lib/mongodb";
import Invite from '@/models/invite';
import { IInvite } from '@/models/types/invite';
import Family from '@/models/family';
import { ObjectId } from 'mongodb';
import { IFamily } from '@/models/types/family';
import MongoUser from '@/models/user';
import { NewMembers } from '@/components/forms/addFamMemForm';
import { spawnSync } from "child_process";
import path from "path";

type ItemType = { newMember: IFamilyMember, newToken: string };

async function sendEmail({ email, inviteToken, senderName, senderEmail, family, url }: {
    email: string,
    inviteToken: string,
    senderName: string,
    senderEmail: string,
    family: IFamily,
    apppw: string,
    url: string
}) {
    try {
        const inviteLink = `${url}/invite?token=${inviteToken}`;
        const firstName = email.split('@')[0];
        const familyName = family.name;

        const scriptPath = path.join(process.cwd(), 'utils', 'apihelpers', 'emails', 'generateEmailTemplate.js');
        const result = spawnSync('node', [scriptPath], {
            input: JSON.stringify({ firstName, senderName, familyName, inviteLink }),
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        if (result.error) {
            throw new Error(`Error rendering email: ${result.error.message}`);
        }

        const html = result.stdout.trim();
        console.log('result: ', result)
        console.log('stdout: ', result.stdout);
        console.log('html: ', result.stdout.trim());
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.G_APP_PW,
            },
        });

        await transporter.sendMail({
            from: senderEmail,
            to: email,
            subject: `Invitation from ${senderName}`,
            html,
        });

        return NextResponse.json({ status: 200, sent: true })

    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ status: 500, sent: false, error: error.message });
    }
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

    const senderEmail = 'cdseaholm@gmail.com';
    const senderName = 'Carl';

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
            const sent = await sendEmail({ email: item.newMember.familyMemberEmail, inviteToken: item.newToken, senderName, senderEmail, family: thisFamily, apppw: apppw, url: url });
            if (sent.status === 500) {
                return NextResponse.json({ status: 500, message: `Errors with ${item.newMember.familyMemberEmail}`, famMembersReturned: [] as IFamilyMember[] });
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
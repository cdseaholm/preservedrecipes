import { IUser } from '@/models/types/user';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/invite';

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', userInfo: {} as IUser });
    }

    const session = await getServerSession();

    const token = await getToken({ req, secret });

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from session' });
    }

    if (!token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from token' });
    }

    const user = session.user;

    if (!user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from user' });
    }

    const senderEmail = user.email;
    const senderName = user.name;

    if (!senderEmail || !senderName) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from email' });
    }

    try {
        const body = await req.json();
        await connectDB();
        const message = body.message;
        const sendToEmail = body.sendToEmail;
        const familyID = body.familyID;
        const inviteToken = crypto.randomBytes(20).toString('hex');


        await Invite.create({
            email: sendToEmail,
            familyID,
            token: inviteToken,
        });

        const inviteLink = `${process.env.BASE_URL}/invite?token=${inviteToken}`;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.G_APP_PW,
            },
        });

        const mailOptions: Mail.Options = {
            from: process.env.EMAIL_FROM,
            to: sendToEmail,
            subject: `Invitation from ${senderName} (${senderEmail})`,
            text: `${message}\n\nClick the link to join: ${inviteLink}`,
        };

        const sendMailPromise = () =>
            new Promise<string>((resolve, reject) => {
                transport.sendMail(mailOptions, function (err) {
                    if (!err) {
                        resolve('Email sent');
                    } else {
                        reject(err.message);
                    }
                });
            });

        await sendMailPromise();
        const response = NextResponse.json({ message: 'Email sent', status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
    } catch (err) {
        return NextResponse.json({ error: err, status: 500 });
    }
}
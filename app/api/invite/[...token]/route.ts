import connectDB from "@/lib/mongodb";
import Invite from "@/models/invite";
import { IInvite } from "@/models/types/invite";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const token = req.url.split('/')[5];

    try {
        await connectDB();

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token', inviteReturned: {} as IInvite, userExists: false });
        }

        const invite = await Invite.findOne({ token }) as IInvite;

        if (!invite) {
            return NextResponse.json({ status: 402, message: 'Invite error', inviteReturned: {} as IInvite, userExists: false });
        }

        const userToSeek = invite.email;
        const user = await MongoUser.findOne({ email: userToSeek }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 200, message: 'Invite found, no user exists', inviteReturned: invite, userExists: false });
        }

        return NextResponse.json({ status: 200, message: 'Invite and user found', inviteReturned: invite, userExists: true });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error, inviteReturned: {} as IInvite, userExists: false })
    }
}
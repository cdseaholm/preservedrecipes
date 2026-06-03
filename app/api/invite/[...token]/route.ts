import connectDB from "@/lib/mongodb";
import { findValidInviteByToken, normalizeInviteEmail, serializeInvite } from "@/lib/invite-utils";
import { IInvite } from "@/models/types/misc/invite";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ token?: string[] }> }
) {
    const { token: tokenParts } = await params;
    const token = tokenParts?.[0] || '';

    try {
        await connectDB();

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token', inviteReturned: {} as IInvite, userExists: false });
        }

        const { invite, message } = await findValidInviteByToken(token);

        if (!invite) {
            return NextResponse.json({ status: 402, message, inviteReturned: {} as IInvite, userExists: false });
        }

        if ((invite.inviteType || 'family') !== 'family') {
            return NextResponse.json({ status: 400, message: 'This invite is available in your profile inbox', inviteReturned: {} as IInvite, userExists: false });
        }

        const userToSeek = normalizeInviteEmail(invite.email);
        const user = await MongoUser.findOne({ email: userToSeek }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 200, message: 'Invite found, no user exists', inviteReturned: serializeInvite(invite), userExists: false });
        }

        return NextResponse.json({ status: 200, message: 'Invite and user found', inviteReturned: serializeInvite(invite), userExists: true });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error, inviteReturned: {} as IInvite, userExists: false })
    }
}

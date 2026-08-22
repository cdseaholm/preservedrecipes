import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import { acceptFamilyInviteForUser, findValidInviteByToken, normalizeInviteEmail } from "@/lib/invite-utils";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { IFamilyMember } from "@/models/types/family/familyMember";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', returnedMembers: [] as IFamilyMember[] });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
    }

    try {
        await connectDB();
        const body = await req.json();
        const inviteToken = typeof body.token === 'string'
            ? body.token
            : typeof body.invite?.token === 'string'
                ? body.invite.token
                : '';

        if (!inviteToken) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
        }

        const { invite, message } = await findValidInviteByToken(inviteToken);

        if (!invite) {
            return NextResponse.json({ status: 404, message, returnedMembers: [] as IFamilyMember[] });
        }

        if ((invite.inviteType || 'family') !== 'family') {
            return NextResponse.json({ status: 400, message: 'This is not a family invite', returnedMembers: [] as IFamilyMember[] });
        }

        const userSesh = session?.user as User;
        const email = normalizeInviteEmail(userSesh?.email);
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
        }

        if (email !== normalizeInviteEmail(invite.email)) {
            return NextResponse.json({ status: 403, message: 'Sign in as the invited user to accept this invite', returnedMembers: [] as IFamilyMember[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', returnedMembers: [] as IFamilyMember[] });
        }

        const accepted = await acceptFamilyInviteForUser(invite, user);
        if (!accepted.success) {
            return NextResponse.json({ status: accepted.status, message: accepted.message, returnedMembers: [] as IFamilyMember[] });
        }

        return NextResponse.json({ status: 200, message: 'Success!', returnedMembers: accepted.members });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error fetching', returnedMembers: [] as IFamilyMember[] });
    }
}

import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import { findValidInviteByToken, normalizeInviteEmail } from "@/lib/invite-utils";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import Family from "@/models/family";
import { ObjectId } from "mongodb";
import { IFamily } from "@/models/types/family/family";
import { IFamilyMember } from "@/models/types/family/familyMember";
import Invite from "@/models/invite";

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

        if (!ObjectId.isValid(invite.familyID)) {
            return NextResponse.json({ status: 400, message: 'Invalid family id', returnedMembers: [] as IFamilyMember[] });
        }

        const famObjectID = new ObjectId(invite.familyID);
        const thisFam = await Family.findOne({ _id: famObjectID }) as IFamily;

        if (!thisFam) {
            return NextResponse.json({ status: 404, message: 'Family not found', returnedMembers: [] as IFamilyMember[] });
        }

        if (user.userFamilyID && user.userFamilyID !== invite.familyID) {
            return NextResponse.json({ status: 406, message: "User must leave current family to accept this invite", returnedMembers: [] as IFamilyMember[] })
        }

        await MongoUser.updateOne({ email: email }, { userFamilyID: invite.familyID });

        const famMembers = thisFam.familyMembers;
        const famMembersWithout = famMembers.filter((member) => normalizeInviteEmail(member.familyMemberEmail) !== email);
        const memberToChange = famMembers.find((member) => normalizeInviteEmail(member.familyMemberEmail) === email);

        if (!memberToChange) {
            const alreadyConnected = famMembers.find((member) => member.familyMemberID === user._id.toString() && member.memberConnected);
            if (user.userFamilyID === invite.familyID && alreadyConnected) {
                await Invite.deleteOne({ token: invite.token });
                return NextResponse.json({ status: 200, message: 'Invite already accepted', returnedMembers: famMembers });
            }
            return NextResponse.json({ status: 404, message: 'Family member not found', returnedMembers: [] as IFamilyMember[] });
        }

        const newMember = {
            familyMemberEmail: memberToChange.familyMemberEmail,
            familyMemberID: user._id.toString(),
            familyMemberName: user.name,
            memberConnected: true,
            permissionStatus: memberToChange.permissionStatus
        } as IFamilyMember;

        const updatedMembers = [
            ...famMembersWithout,
            newMember
        ] as IFamilyMember[];

        await Family.updateOne({ _id: famObjectID }, { $set: { familyMembers: updatedMembers } });

        await Invite.deleteOne({ token: invite.token });

        return NextResponse.json({ status: 200, message: 'Success!', returnedMembers: updatedMembers });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error fetching', returnedMembers: [] as IFamilyMember[] });
    }
}

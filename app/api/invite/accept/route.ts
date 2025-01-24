import { connectDB } from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { IInvite } from "@/models/types/invite";
import Family from "@/models/family";
import { ObjectId } from "mongodb";
import { IFamily } from "@/models/types/family";
import { IFamilyMember } from "@/models/types/familyMember";
import Invite from "@/models/invite";

export async function PUT(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', returnedMembers: [] as IFamilyMember[] });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
    }

    try {
        await connectDB();
        const body = await req.json();
        const invite = body.invite as IInvite;

        if (!invite) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
        }

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', returnedMembers: [] as IFamilyMember[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', returnedMembers: [] as IFamilyMember[] });
        }

        const famObjectID = new ObjectId(invite.familyID);
        const thisFam = await Family.findOne({ _id: famObjectID }) as IFamily;

        if (!thisFam) {
            return NextResponse.json({ status: 404, message: 'Family not found', returnedMembers: [] as IFamilyMember[] });
        }

        await MongoUser.updateOne({ email: email }, { userFamilyID: invite.familyID });

        const famMembers = thisFam.familyMembers;
        const famMembersWithout = famMembers.filter((member) => member.familyMemberEmail !== invite.email);
        const memberToChange = famMembers.find((member) => member.familyMemberEmail === invite.email);

        if (!memberToChange) {
            return NextResponse.json({ status: 404, message: 'Family member not found', returnedMembers: [] as IFamilyMember[] });
        }

        const newMember = {
            ...memberToChange,
            memberConnected: true
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
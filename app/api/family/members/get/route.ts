import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { User } from "next-auth";
import { IFamilyMember } from "@/models/types/familyMember";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', members: [] as IFamilyMember[] });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', members: [] as IFamilyMember[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', members: [] as IFamilyMember[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', members: [] as IFamilyMember[] });
        }

        const familyID = user.userFamilyID as string;
        const famHub = await Family.findOne({ _id: familyID }) as IFamily;

        if (!famHub) {
            return NextResponse.json({ status: 404, message: 'User family not found', members: [] as IFamilyMember[] })
        }

        const memberIDs = famHub.familyMembers as IFamilyMember[];

        const memberPromises = memberIDs.map(async (member) => {
            const memberID = member.familyMemberID;
            const memberFound = await MongoUser.findOne({ memberID }) as IUser;
            return memberFound;
        });

        const members = await Promise.all(memberPromises);

        const filteredMembers = members.filter(member => member !== null);

        return NextResponse.json({ status: 200, message: 'Success!', members: filteredMembers });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', members: [] as IFamilyMember[] });
    }
}
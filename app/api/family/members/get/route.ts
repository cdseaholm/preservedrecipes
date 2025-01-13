import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { IUserFamily } from "@/models/types/userFamily";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { FamilyMemberRelation } from "@/models/types/familyMemberRelation";
import { User } from "next-auth";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', members: [] as FamilyMemberRelation[] });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', members: [] as FamilyMemberRelation[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', members: [] as FamilyMemberRelation[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', members: [] as FamilyMemberRelation[] });
        }

        const family = user.userFamily as IUserFamily;
        const familyID = family.familyID as string;
        const famHub = await Family.findOne({ familyID }) as IFamily;

        if (!famHub) {
            return NextResponse.json({ status: 404, message: 'User family not found', members: [] as FamilyMemberRelation[] })
        }

        const memberIDs = famHub.familyMemberIDs as string[];

        const memberPromises = memberIDs.map(async (id) => {
            const member = await MongoUser.findOne({ id }) as IUser;
            return member;
        });

        const members = await Promise.all(memberPromises);

        const filteredMembers = members.filter(member => member !== null);

        return NextResponse.json({ status: 200, message: 'Success!', members: filteredMembers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error', members: [] as FamilyMemberRelation[] });
    }
}
import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret' });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        await connectDB();

        const { famid, userid } = await req.json();

        const user = await User.findById(userid);

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const family = await Family.findById(famid);

        if (!family) {
            return NextResponse.json({ status: 404, message: 'Family not found' });
        }
        
        const userInFamily = family.familyMembers.find(member => member.familyMemberID.toString() === userid);

        if (!userInFamily) {
            return NextResponse.json({ status: 400, message: 'User is not a member of this family' });
        }

        await Family.findByIdAndUpdate(famid, { $pull: { familyMembers: { familyMemberID: userid } } });

        await User.findByIdAndUpdate(userid, { $unset: { userFamilyID: "" } });

        return NextResponse.json({ status: 200, message: 'Successfully left family' });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Server error' });
    }
}
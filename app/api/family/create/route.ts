import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { IFamilyMember } from "@/models/types/family/familyMember";
import { FamilyFormType } from "@/components/forms/family/familyForm";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', familyReturned: {} as IFamily });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily });
        }

        const family = body.familyPassed as FamilyFormType;

        const initialMembers = [{
            familyMemberName: user.name,
            familyMemberEmail: user.email,
            familyMemberID: user._id.toString(),
            permissionStatus: 'Admin',
        }] as IFamilyMember[];

        const insertedFamily = await Family.create({
            name: family.name,
            recipeIDs: [] as string[],
            familyMembers: initialMembers,
            heritage: family.heritage
        }) as IFamily;

        if (!insertedFamily) {
            return NextResponse.json({ status: 500, message: 'Error creating', familyReturned: {} as IFamily });
        }

        await MongoUser.updateOne({ email: email }, { $set: { userFamilyID: insertedFamily._id.toString() } });

        return NextResponse.json({ status: 200, message: 'Success!', familyReturned: insertedFamily as IFamily });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating family', familyReturned: {} as IFamily });
    }
}
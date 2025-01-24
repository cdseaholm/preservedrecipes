import { connectDB } from "@/lib/mongodb";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { IRecipe } from "@/models/types/recipe";
import { IFamilyMember } from "@/models/types/familyMember";
import { FamilyFormType } from "@/components/forms/familyForm";

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
            console.log("User not found");
            return NextResponse.json({ status: 404, message: 'User not found', familyReturned: {} as IFamily });
        }

        if (user._id.toString() !== token.sub) {
            console.log('token mismatch')
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
            recipes: [] as IRecipe[],
            familyMembers: initialMembers,
            heritage: family.heritage
        }) as IFamily;

        if (!insertedFamily) {
            console.log("Error creating family");
            return NextResponse.json({ status: 500, message: 'Error creating', familyReturned: {} as IFamily });
        }

        await MongoUser.updateOne({ email: email }, { $set: { userFamilyID: insertedFamily._id.toString() } });

        return NextResponse.json({ status: 200, message: 'Success!', familyReturned: insertedFamily as IFamily });

    } catch (error: any) {
        console.error('Error creating family:', error);
        return NextResponse.json({ status: 500, message: 'Error creating family', familyReturned: {} as IFamily });
    }
}
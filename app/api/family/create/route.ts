import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { FamilyCreation } from "@/models/types/inAppCreations/familyCreation";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { IRecipe } from "@/models/types/recipe";
import { IPermissions } from "@/models/types/permission";
import { IUserFamily } from "@/models/types/userFamily";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ status: 404, message: 'User not found', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
        }

        if (user._id.toString() !== token.sub) {
            console.log('token mismatch')
            return NextResponse.json({ status: 401, message: 'Unauthorized', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
        }

        const family = body.familyPassed as FamilyCreation;

        const initIDs = [user._id];

        const admins = [{
            id: user._id,
            name: user.name,
            permissionStatus: 'Admin',
        }] as IPermissions[];

        const insertedFamily = await Family.create({
            name: family.name,
            recipes: [] as IRecipe[],
            familyMemberIDs: initIDs,
            adminIDs: admins,
            heritage: family.heritage
        }) as IFamily;

        if (!insertedFamily) {
            console.log("Error creating family");
            return NextResponse.json({ status: 500, message: 'Error creating', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
        }

        const oldUserFamily = user.userFamily;
        const updatedUserFamily = { siblingIDs: oldUserFamily.siblingIDs, parentIDs: oldUserFamily.parentIDs, partnerIDs: oldUserFamily.partnerIDs, childrenIDs: oldUserFamily.childrenIDs, familyID: insertedFamily._id, userPermission: 'Admin' } as IUserFamily;

        await MongoUser.updateOne({ email: email }, { $set: { userFamily: updatedUserFamily } });

        return NextResponse.json({ status: 200, message: 'Success!', familyReturned: insertedFamily as IFamily, userFamilyReturned: updatedUserFamily });

    } catch (error: any) {
        console.error('Error creating family:', error);
        return NextResponse.json({ status: 500, message: 'Error creating family', familyReturned: {} as IFamily, userFamilyReturned: {} as IUserFamily });
    }
}
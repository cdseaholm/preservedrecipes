import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { IRecipe } from "@/models/types/recipe";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', userInfo: {} as IUser });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', family: {} as IFamily });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', family: {} as IFamily });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', family: {} as IFamily });
        }

        const familyID = user.userFamilyID;

        if (familyID === '') {
            return NextResponse.json({ status: 404, message: 'No Family found', family: {} as IFamily })
        }

        const familyObjectId = new ObjectId(familyID);
        const family = await Family.findOne({ _id: familyObjectId }) as IRecipe;

        if (!family) {
            return NextResponse.json({ status: 404, message: 'No Family found', family: {} as IFamily })
        }

        return NextResponse.json({ status: 200, message: 'Success!', family: family });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error', family: {} as IFamily });
    }
}
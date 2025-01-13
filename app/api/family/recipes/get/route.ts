import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { IUserFamily } from "@/models/types/userFamily";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family";
import { User } from "next-auth";
import { IRecipe } from "@/models/types/recipe";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', familyRecipes: [] as IRecipe[] });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', familyRecipes: [] as IRecipe[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', familyRecipes: [] as IRecipe[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', familyRecipes: [] as IRecipe[] });
        }

        const family = user.userFamily as IUserFamily;
        const familyID = family.familyID as string;
        const famHub = await Family.findOne({ familyID }) as IFamily;

        if (!famHub) {
            return NextResponse.json({ status: 404, message: 'User family not found', familyRecipes: [] as IRecipe[] })
        }

        const recipeIDs = famHub.recipes as IRecipe[];

        return NextResponse.json({ status: 200, message: 'Success!', familyRecipes: recipeIDs });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error', familyRecipes: [] as IRecipe[] });
    }
}
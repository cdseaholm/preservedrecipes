import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipe";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', recipes: [] as IRecipe[] });
    }

    const session = await getServerSession();
    const token = await getToken({ req, secret });

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from session', recipes: [] as IRecipe[] });
    }

    if (!token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from token', recipes: [] as IRecipe[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = userSesh?.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipes: [] as IRecipe[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', recipes: [] as IRecipe[] });
        }

        const recipeIDs = user.recipeIDs;

        if (!recipeIDs || recipeIDs.length === 0) {
            return NextResponse.json({ status: 200, message: 'No recipes found', recipes: [] as IRecipe[] });
        }

        const recipePromises = recipeIDs.map(async (id) => {
            const recipe = await Recipe.findOne({ _id: new ObjectId(id) }) as IRecipe;
            return recipe;
        });

        const recipes = await Promise.all(recipePromises);
        const filteredRecipes = recipes.filter(recipe => recipe !== null);

        return NextResponse.json({ status: 200, message: 'Success!', recipes: filteredRecipes });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', recipes: [] as IRecipe[] });
    }
}
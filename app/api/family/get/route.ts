import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipe";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', userInfo: {} as IUser });
    }

    const session = await getServerSession({ req, secret });
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipes: [] as IRecipe[] });
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
        const recipePromises = recipeIDs.map(async (id) => {
            const recipe = await Recipe.findOne({ id }) as IRecipe;
            return recipe;
        });
        const recipes = await Promise.all(recipePromises);

        if (!recipes) {
            return NextResponse.json({ status: 404, message: 'No recipes found', recipes: [] as IRecipe[] })
        }

        const filteredRecipes = recipes.filter(recipe => recipe !== null);

        return NextResponse.json({ status: 200, message: 'Success!', recipes: filteredRecipes });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error', recipes: [] as IRecipe[] });
    }
}
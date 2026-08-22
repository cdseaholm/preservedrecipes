import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import Recipe from "@/models/recipe";
import { ObjectId } from "mongodb";
import { IRecipe } from "@/models/types/recipes/recipe";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function GET() {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', recipes: [] as IRecipe[] });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized from session', recipes: [] as IRecipe[] });
    }

    try {
        await connectDB();

        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
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

        const objectIds = Array.from(new Set(recipeIDs))
            .filter(id => ObjectId.isValid(id))
            .map(id => new ObjectId(id));

        const filteredRecipes = objectIds.length > 0
            ? await Recipe.find({ _id: { $in: objectIds } }).lean()
            : [];

        return NextResponse.json({ status: 200, message: 'Success!', recipes: filteredRecipes });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', recipes: [] as IRecipe[] });
    }
}

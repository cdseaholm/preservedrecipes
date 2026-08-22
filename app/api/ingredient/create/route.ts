import connectDB from "@/lib/mongodb";
import Ingredient from "@/models/ingredient";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', ingredientsReturned: [] as IIngredient[] });
    }

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', ingredientsReturned: [] as IIngredient[] });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', ingredientsReturned: [] as IIngredient[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', ingredientsReturned: [] as IIngredient[] });
        }

        const ingredients = body.newIngredients as IIngredient[];
        if (!ingredients || ingredients.length <= 0) {
            return NextResponse.json({ status: 400, message: 'No ingredients provided', ingredientsReturned: [] as IIngredient[] });
        }

        const insertResult = await Ingredient.insertMany(ingredients.map(ing => ({
            ingredient: ing.ingredient.trim(),
        })));

        if (!insertResult || insertResult.length <= 0) {
            return NextResponse.json({ status: 500, message: 'Error creating', ingredientsReturned: [] as IIngredient[] });
        }

        return NextResponse.json({ status: 200, message: 'Success!', ingredientsReturned: insertResult as IIngredient[] });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating ingredient', ingredientsReturned: [] as IIngredient[] });
    }
}

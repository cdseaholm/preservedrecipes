import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IReview } from "@/models/types/misc/review";
import { getUploadThingKeyFromUrl } from "@/utils/uploadthing/file-key";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function PUT(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
    }

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', recipeReturned: {} as IRecipe });
        }

        const recipe = body.recipePassed as IRecipe;
        const newRecipe = {
            name: recipe.name,
            image: recipe.image,
            imageKey: recipe.imageKey || getUploadThingKeyFromUrl(recipe.image),
            creatorID: user._id.toString(),
            steps: recipe.steps,
            reviews: [] as IReview[],
            secret: recipe.secret,
            secretViewerIDs: recipe.secretViewerIDs,
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            description: recipe.description,
            cookingTime: recipe.cookingTime,
            recipeFor: recipe.recipeFor,
            //make sure when fetching recipes, if creatorID is empty, this suggests deleted user, add "Deleted User" as name
            favoriteCount: recipe.favoriteCount,
            saveCount: recipe.saveCount,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        } as IRecipe;

        const insertedRecipe = await Recipe.create(newRecipe);

        if (!insertedRecipe) {
            return NextResponse.json({ status: 500, message: 'Error creating', recipeReturned: {} as IRecipe });
        }

        const recipeId = insertedRecipe._id;

        await MongoUser.updateOne({ email: email }, { $push: { recipeIDs: recipeId.toString() } });

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!', recipeReturned: insertedRecipe as IRecipe });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe', recipeReturned: {} as IRecipe });
    }
}

import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IComment } from "@/models/types/comment";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { revalidatePath } from "next/cache";
import { RecipeFormType } from "@/components/forms/recipe/recipeForm";
import Family from "@/models/family";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', recipeReturned: {} as IRecipe });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe });
        }

        const recipe = body.recipePassed as RecipeFormType;
        const newRecipe = {
            name: recipe.name,
            recipeType: recipe.type,
            image: '',
            creatorID: user._id.toString(),
            steps: recipe.steps,
            rating: -1,
            comments: [] as IComment[],
            secret: recipe.secret,
            secretViewerIDs: recipe.secretViewerIDs,
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            description: recipe.description
        } as IRecipe;

        const insertedRecipe = await Recipe.create(newRecipe);

        if (!insertedRecipe) {
            return NextResponse.json({ status: 500, message: 'Error creating', recipeReturned: {} as IRecipe });
        }


        const recipeId = insertedRecipe._id;

        await MongoUser.updateOne({ email: email }, { $push: { recipeIDs: recipeId.toString() } });

        const isFamilyRecipe = recipe.familyRecipe;

        if (isFamilyRecipe) {
            const userFam = await Family.findOne({ _id: user.userFamilyID });
            if (!userFam) {
                //contigency
                return NextResponse.json({ status: 404, message: 'Could not find family, otherwise created', recipeReturned: {} as IRecipe });
            }
            const oldRecipes = userFam.recipes;
            const newRecipes = [...oldRecipes, newRecipe] as IRecipe[];
            await userFam.updateOne({ recipes: newRecipes })
        }

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!', recipeReturned: insertedRecipe as IRecipe });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe', recipeReturned: {} as IRecipe });
    }
}
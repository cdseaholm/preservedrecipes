import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { getServerSession, User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import MongoUser from "@/models/user";
import Community from "@/models/community";
import { IIngredient, IngredientForForm } from "@/models/types/recipes/ingredient";
import Ingredient from "@/models/ingredient";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        const recipe = body.recipePassed as IRecipe;

        if (!recipe) {
            return NextResponse.json({ status: 400, message: 'No recipe data', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        const type = body.type as 'personal' | 'family' | 'community' | 'post';
        if (type !== 'personal' && type !== 'family' && type !== 'community' && type !== 'post') {
            return NextResponse.json({ status: 400, message: 'Invalid type', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        const typeId = body.typeId as string;

        // Only validate typeId for family and community recipes
        if ((type === 'family' || type === 'community') && !typeId) {
            return NextResponse.json({ status: 400, message: 'Invalid typeId required for family/community recipes', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        const processedIngredients: IngredientForForm[] = [];

        for (const recipeIng of recipe.ingredients) {
            let dbIngredient: IIngredient | null = null;

            // Try to find by ID first (if provided)
            if (recipeIng.ingredientId) {
                dbIngredient = await Ingredient.findById(recipeIng.ingredientId) as IIngredient;
            }

            // If not found, try by name
            if (!dbIngredient) {
                dbIngredient = await Ingredient.findOne({ ingredient: recipeIng.ingredient }) as IIngredient;
            }

            // If still not found, create it
            if (!dbIngredient) {
                dbIngredient = await Ingredient.create({ ingredient: recipeIng.ingredient }) as IIngredient;
                console.log("Created new ingredient:", dbIngredient.ingredient);
            }

            processedIngredients.push({
                ingredientId: dbIngredient._id.toString(),
                ingredient: dbIngredient.ingredient,
                quantity: recipeIng.quantity,
            } as IngredientForForm);
        }

        const insertedRecipe = await Recipe.create({
            name: recipe.name,
            recipeType: recipe.recipeType,
            cookingTime: recipe.cookingTime,
            recipeFor: recipe.recipeFor,
            image: recipe.image,
            creatorID: user._id.toString(),
            steps: recipe.steps,
            reviews: recipe.reviews,
            secret: recipe.secret,
            secretViewerIDs: recipe.secretViewerIDs,
            tags: recipe.tags,
            ingredients: processedIngredients,
            description: recipe.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }) as IRecipe;

        if (!insertedRecipe) {
            return NextResponse.json({ status: 500, message: 'Error creating', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
        }


        const recipeId = insertedRecipe._id;

        await MongoUser.updateOne({ email: email }, { $push: { recipeIDs: recipeId.toString() } });

        if (type === 'family' && typeId && typeId !== '') {
            const userFam = await Family.findOne({ _id: typeId });
            if (!userFam) {
                //contigency
                return NextResponse.json({ status: 206, message: 'Could not find family, otherwise created', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
            }
            const oldRecipeIDs = userFam.recipeIDs;
            const newRecipeIDs = [...oldRecipeIDs, insertedRecipe._id.toString()] as string[];
            const updatedFam = await Family.updateOne({ _id: typeId }, { recipeIDs: newRecipeIDs });
            if (!updatedFam) {
                console.log("Failed to update family: ", userFam);
                //contigency
                return NextResponse.json({ status: 206, message: 'Could not update family, otherwise created', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
            }
        } else if (type === 'community' && typeId && typeId !== '') {
            const community = await Community.findOne({ _id: typeId });
            if (!community) {
                //contigency
                return NextResponse.json({ status: 206, message: 'Could not find community, otherwise created', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
            }
            const oldRecipes = community.recipeIDs;
            const newRecipes = [...oldRecipes, insertedRecipe._id.toString()] as string[];
            const updatedCommunity = await Community.updateOne({ _id: typeId }, { recipeIDs: newRecipes });
            if (!updatedCommunity) {
                return NextResponse.json({ status: 206, message: 'Could not update community, otherwise created', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
            }

        }

        const returnedIngredients = await Ingredient.find({}).lean() as IIngredient[];

        if (!returnedIngredients) {
            return NextResponse.json({ status: 500, message: 'Error fetching ingredients', recipeReturned: insertedRecipe as IRecipe, returnedIngredients: [] as IIngredient[] });
        }

        return NextResponse.json({ status: 200, message: 'Success!', recipeReturned: insertedRecipe as IRecipe, returnedIngredients: returnedIngredients as IIngredient[] });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe', recipeReturned: {} as IRecipe, returnedIngredients: [] as IIngredient[] });
    }
}
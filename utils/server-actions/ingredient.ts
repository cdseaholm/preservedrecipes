'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth/auth-options";
import User from '@/models/user';
import Ingredient from '@/models/ingredient';
import { IIngredient, IngredientForForm } from '@/models/types/recipes/ingredient';

export async function CreateIngredient(ingName: IngredientForForm, path: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized', ingredientId: null };
    }

    if (!ingName) {
        return { success: false, message: 'Ingredient data is required', ingredientId: null };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, message: 'User not found', ingredientId: null };
        }

        //later might need to do lowercase checks and trims for optimization and to prevent duplicates that are just capitalized or have extra spaces
        const existingIngredient = await Ingredient.findOne({ ingredient: ingName.ingredient }) as IIngredient;

        if (existingIngredient) {
            return { success: true, message: 'Ingredient already exists', ingredientId: existingIngredient._id.toString() };
        }

        const newIngredient = await Ingredient.create({
            ingredient: ingName.ingredient,
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as IIngredient;

        // ✅ This automatically refreshes the page data
        revalidatePath(path);
        
        return { 
            success: true, 
            message: 'Ingredient created successfully',
            ingredientId: newIngredient._id.toString()
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to create ingredient', ingredientId: null };
    }
}

//removing edit and delete ingredient since that's not going to be used directly for now
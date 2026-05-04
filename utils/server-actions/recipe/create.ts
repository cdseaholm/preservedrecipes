'use server'

import { revalidatePath } from 'next/cache';
import Recipe from '@/models/recipe';
import { IRecipe } from '@/models/types/recipes/recipe';
import User from '@/models/user';
import { IngredientForForm } from '@/models/types/recipes/ingredient';
import { CreateIngredient } from '../ingredient/create';
import { IReview } from '@/models/types/misc/review';
import { cleanStringArray, getAuthenticatedUser, getRevalidationPath } from './utils';
import { getUploadThingKeyFromUrl } from '@/utils/uploadthing/file-key';

export async function CreateRecipe(values: IRecipe, route: string) {
    if (!values) {
        return { success: false, message: 'Recipe data is required', recipeId: null };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation', recipeId: null };
    }

    try {
        const { user, message } = await getAuthenticatedUser();
        if (!user) {
            return { success: false, message, recipeId: null };
        }

        const ingredientsForRecipes = [] as IngredientForForm[];
        for (const ing of values.ingredients || []) {
            const ingredientCheck = await CreateIngredient(ing, getRevalidationPath(route));
            if (ingredientCheck.success && ingredientCheck.ingredientId) {
                ingredientsForRecipes.push({
                    ingredient: ing.ingredient,
                    quantity: ing.quantity,
                    ingredientId: ingredientCheck.ingredientId,
                });
            }
        }

        const newRecipe = await Recipe.create({
            name: values.name,
            description: values.description,
            ingredients: ingredientsForRecipes,
            steps: values.steps,
            recipeType: values.recipeType,
            tags: values.tags,
            image: values.image,
            imageKey: values.imageKey || getUploadThingKeyFromUrl(values.image),
            reviews: [] as IReview[],
            recipeFor: values.recipeFor,
            secret: values.secret,
            secretViewerIDs: values.secret ? cleanStringArray(values.secretViewerIDs) : [] as string[],
            cookingTime: values.cookingTime,
            creatorID: user._id.toString(),
            favoriteCount: 0,
            saveCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as IRecipe;

        if (!newRecipe) {
            return { success: false, message: 'Failed to create recipe', recipeId: null };
        }

        await User.findByIdAndUpdate(user._id, {
            $push: { recipeIDs: newRecipe._id.toString() }
        });

        revalidatePath(getRevalidationPath(route));

        return {
            success: true,
            message: 'Recipe created successfully',
            recipeId: newRecipe._id.toString()
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to create recipe', recipeId: null };
    }
}

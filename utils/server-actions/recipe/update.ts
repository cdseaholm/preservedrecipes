'use server'

import { revalidatePath } from 'next/cache';
import Recipe from '@/models/recipe';
import { IRecipe } from '@/models/types/recipes/recipe';
import { IngredientForForm } from '@/models/types/recipes/ingredient';
import { CreateIngredient } from '../ingredient/create';
import { cleanStringArray, getAuthenticatedUser, getRevalidationPath, isValidId } from './utils';

export async function UpdateRecipe(recipeId: string, recipeData: IRecipe, route: string) {
    if (!recipeData || !recipeId) {
        return { success: false, message: 'Recipe data is required' };
    }

    if (!isValidId(recipeId)) {
        return { success: false, message: 'Invalid recipe ID' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        const { user, message } = await getAuthenticatedUser();
        if (!user) {
            return { success: false, message };
        }

        const existingRecipe = await Recipe.findById(recipeId).select('creatorID').lean();
        if (!existingRecipe) {
            return { success: false, message: 'Recipe not found' };
        }

        if (existingRecipe.creatorID !== user._id.toString()) {
            return { success: false, message: 'Only the recipe creator can edit this recipe' };
        }

        const ingredientsForRecipes = [] as IngredientForForm[];
        for (const ing of recipeData.ingredients || []) {
            if (ing.ingredientId) {
                ingredientsForRecipes.push(ing);
            } else {
                const ingredientCheck = await CreateIngredient(ing, getRevalidationPath(route));
                if (ingredientCheck.success && ingredientCheck.ingredientId) {
                    ingredientsForRecipes.push({
                        ingredient: ing.ingredient,
                        quantity: ing.quantity,
                        ingredientId: ingredientCheck.ingredientId,
                    });
                }
            }
        }

        await Recipe.findByIdAndUpdate(recipeId, {
            name: recipeData.name,
            description: recipeData.description,
            ingredients: ingredientsForRecipes,
            steps: recipeData.steps,
            recipeType: recipeData.recipeType,
            tags: recipeData.tags,
            image: recipeData.image,
            recipeFor: recipeData.recipeFor,
            secret: recipeData.secret,
            secretViewerIDs: recipeData.secret ? cleanStringArray(recipeData.secretViewerIDs) : [] as string[],
            cookingTime: recipeData.cookingTime,
            updatedAt: new Date(),
        }) as IRecipe;

        revalidatePath(getRevalidationPath(route));

        return { success: true, message: 'Recipe updated successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update recipe' };
    }
}

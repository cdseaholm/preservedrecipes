'use server'

import { revalidatePath } from 'next/cache';
import Recipe from '@/models/recipe';
import User from '@/models/user';
import { IRecipe } from '@/models/types/recipes/recipe';
import { canUserViewRecipe, getAuthenticatedUser, getRevalidationPath, isValidId } from './utils';

export async function ToggleSaveRecipe(recipeId: string, shouldSave: boolean, route: string) {
    if (!recipeId) {
        return { success: false, message: 'Recipe ID is required', saved: false, saveCount: 0 };
    }

    if (!isValidId(recipeId)) {
        return { success: false, message: 'Invalid recipe ID', saved: false, saveCount: 0 };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation', saved: false, saveCount: 0 };
    }

    try {
        const { user, message } = await getAuthenticatedUser();
        if (!user) {
            return { success: false, message, saved: false, saveCount: 0 };
        }

        const userId = user._id.toString();
        const recipe = await Recipe.findById(recipeId).lean<IRecipe>();
        if (!recipe) {
            return { success: false, message: 'Recipe not found', saved: false, saveCount: 0 };
        }

        if (!canUserViewRecipe(recipe, userId, user.email)) {
            return { success: false, message: 'Recipe not found', saved: false, saveCount: 0 };
        }

        const currentSavedIds = user.savedRecipeIDs || [];
        const alreadySaved = currentSavedIds.includes(recipeId);

        if (shouldSave === alreadySaved) {
            return {
                success: true,
                message: alreadySaved ? 'Recipe already saved' : 'Recipe already removed from saved recipes',
                saved: alreadySaved,
                saveCount: recipe.saveCount || 0,
            };
        }

        const userUpdate = shouldSave
            ? await User.updateOne(
                { _id: user._id, savedRecipeIDs: { $ne: recipeId } },
                { $addToSet: { savedRecipeIDs: recipeId } },
            )
            : await User.updateOne(
                { _id: user._id, savedRecipeIDs: recipeId },
                { $pull: { savedRecipeIDs: recipeId } },
            );

        if (userUpdate.modifiedCount === 0) {
            const updatedRecipe = await Recipe.findById(recipeId).select('saveCount').lean<IRecipe>();
            return {
                success: true,
                message: shouldSave ? 'Recipe already saved' : 'Recipe already removed from saved recipes',
                saved: shouldSave,
                saveCount: updatedRecipe?.saveCount || 0,
            };
        }

        const recipeUpdate = shouldSave
            ? await Recipe.findByIdAndUpdate(
                recipeId,
                { $inc: { saveCount: 1 }, updatedAt: new Date() },
                { new: true },
            ).lean<IRecipe>()
            : await Recipe.findOneAndUpdate(
                { _id: recipeId, saveCount: { $gt: 0 } },
                { $inc: { saveCount: -1 }, updatedAt: new Date() },
                { new: true },
            ).lean<IRecipe>();

        revalidatePath(getRevalidationPath(route));

        return {
            success: true,
            message: shouldSave ? 'Recipe saved' : 'Recipe removed from saved recipes',
            saved: shouldSave,
            saveCount: recipeUpdate?.saveCount || 0,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update saved recipes', saved: false, saveCount: 0 };
    }
}

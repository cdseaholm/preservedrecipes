'use server'

import { revalidatePath } from 'next/cache';
import Recipe from '@/models/recipe';
import User from '@/models/user';
import { IRecipe } from '@/models/types/recipes/recipe';
import {
    canAttemptFavoriteToggle,
    canUserViewRecipe,
    getAuthenticatedUser,
    getRevalidationPath,
    isValidId,
} from './utils';

export async function ToggleFavoriteRecipe(recipeId: string, shouldFavorite: boolean, route: string) {
    if (!recipeId) {
        return { success: false, message: 'Recipe ID is required', favorited: false, favoriteCount: 0 };
    }

    if (!isValidId(recipeId)) {
        return { success: false, message: 'Invalid recipe ID', favorited: false, favoriteCount: 0 };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation', favorited: false, favoriteCount: 0 };
    }

    try {
        const { user, message } = await getAuthenticatedUser();
        if (!user) {
            return { success: false, message, favorited: false, favoriteCount: 0 };
        }

        const userId = user._id.toString();
        if (!canAttemptFavoriteToggle(userId)) {
            return {
                success: false,
                message: 'Please wait a moment before updating favorites again',
                favorited: user.favoriteRecipeIDs?.includes(recipeId) || false,
                favoriteCount: 0,
            };
        }

        const recipe = await Recipe.findById(recipeId).lean<IRecipe>();
        if (!recipe) {
            return { success: false, message: 'Recipe not found', favorited: false, favoriteCount: 0 };
        }

        if (!canUserViewRecipe(recipe, userId, user.email)) {
            return { success: false, message: 'Recipe not found', favorited: false, favoriteCount: 0 };
        }

        const currentFavoriteIds = user.favoriteRecipeIDs || [];
        const alreadyFavorited = currentFavoriteIds.includes(recipeId);

        if (shouldFavorite === alreadyFavorited) {
            return {
                success: true,
                message: alreadyFavorited ? 'Recipe already favorited' : 'Recipe already removed from favorites',
                favorited: alreadyFavorited,
                favoriteCount: recipe.favoriteCount || 0,
            };
        }

        const userUpdate = shouldFavorite
            ? await User.updateOne(
                { _id: user._id, favoriteRecipeIDs: { $ne: recipeId } },
                { $addToSet: { favoriteRecipeIDs: recipeId } },
            )
            : await User.updateOne(
                { _id: user._id, favoriteRecipeIDs: recipeId },
                { $pull: { favoriteRecipeIDs: recipeId } },
            );

        if (userUpdate.modifiedCount === 0) {
            const updatedRecipe = await Recipe.findById(recipeId).select('favoriteCount').lean<IRecipe>();
            return {
                success: true,
                message: shouldFavorite ? 'Recipe already favorited' : 'Recipe already removed from favorites',
                favorited: shouldFavorite,
                favoriteCount: updatedRecipe?.favoriteCount || 0,
            };
        }

        const recipeUpdate = shouldFavorite
            ? await Recipe.findByIdAndUpdate(
                recipeId,
                { $inc: { favoriteCount: 1 }, updatedAt: new Date() },
                { new: true },
            ).lean<IRecipe>()
            : await Recipe.findOneAndUpdate(
                { _id: recipeId, favoriteCount: { $gt: 0 } },
                { $inc: { favoriteCount: -1 }, updatedAt: new Date() },
                { new: true },
            ).lean<IRecipe>();

        revalidatePath(getRevalidationPath(route));

        return {
            success: true,
            message: shouldFavorite ? 'Recipe added to favorites' : 'Recipe removed from favorites',
            favorited: shouldFavorite,
            favoriteCount: recipeUpdate?.favoriteCount || 0,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update favorites', favorited: false, favoriteCount: 0 };
    }
}

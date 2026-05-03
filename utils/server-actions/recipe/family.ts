'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/recipe';
import Family from '@/models/family';
import { getRevalidationPath } from './utils';
import { getAuthenticatedFamilyContext } from '../family/utils';

export async function AddRecipeToFamily(recipeId: string, familyId: string, route: string) {
    if (!recipeId || !familyId) {
        return { success: false, message: 'Recipe ID and Family ID are required' };
    }

    try {
        await connectDB();
        const { user, family, message } = await getAuthenticatedFamilyContext(familyId);
        if (!user || !family) {
            return { success: false, message };
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return { success: false, message: 'Recipe not found' };
        }

        const recipeCreator = recipe.creatorID === user._id.toString();
        const explicitlyViewable = recipe.secretViewerIDs?.includes(user._id.toString()) || recipe.secretViewerIDs?.includes(user.email);
        if (recipe.secret && !recipeCreator && !explicitlyViewable) {
            return { success: false, message: 'Recipe not found' };
        }

        await Family.findByIdAndUpdate(family._id, {
            $addToSet: { recipeIDs: recipeId }
        });
        revalidatePath(getRevalidationPath(route));
        return { success: true, message: 'Recipe added to family successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add recipe to family' };
    }
}

export async function RemoveRecipesFromFamily(recipeIds: string[], familyId: string, route: string) {
    if (!recipeIds || recipeIds.length === 0) {
        return { success: false, message: 'Recipe IDs are required' };
    }

    if (!familyId) {
        return { success: false, message: 'Family ID is required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        const { user, family, message } = await getAuthenticatedFamilyContext(familyId);
        if (!user || !family) {
            return { success: false, message };
        }

        family.recipeIDs = family.recipeIDs.filter(id => !recipeIds.includes(id));
        await family.save();

        revalidatePath(getRevalidationPath(route));

        return { success: true, message: 'Recipes removed from family successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to remove recipes from family' };
    }
}

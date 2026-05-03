'use server'

import { revalidatePath } from 'next/cache';
import Recipe from '@/models/recipe';
import User from '@/models/user';
import { getAuthenticatedUser, getRevalidationPath, isValidId } from './utils';

export async function DeleteRecipes(recipeIds: string[], route: string) {
    if (!recipeIds || recipeIds.length === 0) {
        return { success: false, message: 'Recipe IDs are required' };
    }

    const uniqueRecipeIds = Array.from(new Set(recipeIds));
    if (!uniqueRecipeIds.every(isValidId)) {
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

        const userId = user._id.toString();
        const ownedRecipes = await Recipe.find({
            _id: { $in: uniqueRecipeIds },
            creatorID: userId,
        }).select('_id').lean();

        const ownedRecipeIds = ownedRecipes.map(recipe => recipe._id.toString());
        if (ownedRecipeIds.length !== uniqueRecipeIds.length) {
            return { success: false, message: 'Only recipes you created can be deleted' };
        }

        await Recipe.deleteMany({ _id: { $in: ownedRecipeIds }, creatorID: userId });

        await User.findByIdAndUpdate(user._id, {
            $pull: { recipeIDs: { $in: ownedRecipeIds } }
        });

        revalidatePath(getRevalidationPath(route));

        return { success: true, message: 'Recipes deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete recipes' };
    }
}

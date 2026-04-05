'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth/auth-options";
import { IRecipe } from '@/models/types/recipes/recipe';
import User from '@/models/user';
import { IngredientForForm } from '@/models/types/recipes/ingredient';
import { CreateIngredient } from './ingredient';
import { IUser } from '@/models/types/personal/user';
import { IReview } from '@/models/types/misc/review';
import Family from '@/models/family';

export async function CreateRecipe(values: IRecipe, route: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized', recipeId: null };
    }

    if (!values) {
        return { success: false, message: 'Recipe data is required', recipeId: null };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation', recipeId: null };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: session.user.email }) as IUser;
        if (!user) {
            return { success: false, message: 'User not found', recipeId: null };
        }

        const ingredientsForRecipes = [] as IngredientForForm[];
        for (const ing of values.ingredients) {
            const ingredientCheck = await CreateIngredient(ing, route);
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
            reviews: [] as IReview[],
            recipeFor: values.recipeFor,
            secret: values.secret,
            secretViewerIDs: values.secret ? values.secretViewerIDs : [] as string[],
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

        revalidatePath(route);
        
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

export async function AddRecipeToFamily(recipeId: string, familyId: string, route: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }
    if (!recipeId || !familyId) {
        return { success: false, message: 'Recipe ID and Family ID are required' };
    }

    try {
        await connectDB();
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return { success: false, message: 'Recipe not found' };
        }
        await Family.findByIdAndUpdate(familyId, {
            $addToSet: { recipeIDs: recipeId }
        });
        revalidatePath(route);
        return { success: true, message: 'Recipe added to family successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add recipe to family' };
    }
}

export async function UpdateRecipe(recipeId: string, recipeData: IRecipe, route: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!recipeData || !recipeId) {
        return { success: false, message: 'Recipe data is required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        await connectDB();

        const ingredientsForRecipes = [] as IngredientForForm[];
        for (const ing of recipeData.ingredients) {
            if (ing.ingredientId) {
                ingredientsForRecipes.push(ing);
            } else {
                const ingredientCheck = await CreateIngredient(ing, route);
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
            ingredients: recipeData.ingredients,
            steps: recipeData.steps,
            recipeType: recipeData.recipeType,
            tags: recipeData.tags,
            image: recipeData.image,
            reviews: recipeData.reviews,
            recipeFor: recipeData.recipeFor,
            secret: recipeData.secret,
            secretViewerIDs: recipeData.secret ? recipeData.secretViewerIDs : [] as string[],
            cookingTime: recipeData.cookingTime,
            creatorID: recipeData.creatorID,
            createdAt: recipeData.createdAt,
            favoriteCount: recipeData.favoriteCount || 0,
            saveCount: recipeData.saveCount || 0,
            updatedAt: new Date(),
        }) as IRecipe;

        // ✅ Refresh the data
        revalidatePath(route);
        
        return { success: true, message: 'Recipe updated successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update recipe' };
    }
}

export async function DeleteRecipes(recipeIds: string[], route: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!recipeIds || recipeIds.length === 0) {
        return { success: false, message: 'Recipe IDs are required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        await Recipe.deleteMany({ _id: { $in: recipeIds } });

        await User.findByIdAndUpdate(user._id, {
            $pull: { recipeIDs: { $in: recipeIds } }
        });

        // ✅ Refresh the data
        revalidatePath(route);
        
        return { success: true, message: 'Recipes deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete recipes' };
    }
}

export async function RemoveRecipesFromFamily(recipeIds: string[], familyId: string, route: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

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
        await connectDB();

        const family = await Family.findById(familyId);
        if (!family) {
            return { success: false, message: 'Family not found' };
        }

        // Remove recipes from family
        family.recipeIDs = family.recipeIDs.filter(id => !recipeIds.includes(id));
        await family.save();

        // ✅ Refresh the data
        revalidatePath(route);

        return { success: true, message: 'Recipes removed from family successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to remove recipes from family' };
    }
}
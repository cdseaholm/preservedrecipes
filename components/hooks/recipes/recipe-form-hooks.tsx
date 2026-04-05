// hooks/recipe/use-recipe-form.ts
'use client'

import { usePathname, useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IngredientForForm } from "@/models/types/recipes/ingredient";
import { IStep } from "@/models/types/recipes/step";
import { CreateRecipe, UpdateRecipe, DeleteRecipes } from "@/utils/server-actions/recipe";
import { IUser } from "@/models/types/personal/user";
import { UpdateUser } from "@/utils/server-actions/user";
import { useUserStore } from "@/context/userStore";

export function useRecipeForm({ initialRecipe, userInfo }: { initialRecipe: IRecipe | null, userInfo: IUser | null }) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [attemptedToCreate, setAttemptedToCreate] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const pathname = usePathname();
    const setUserInfo = useUserStore(state => state.setUserInfo);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            _id: initialRecipe?._id || '',
            name: initialRecipe?.name || '',
            description: initialRecipe?.description || '',
            ingredients: initialRecipe?.ingredients || [],
            steps: initialRecipe?.steps || [],
            recipeType: initialRecipe?.recipeType || '',
            tags: initialRecipe?.tags || [],
            image: initialRecipe?.image || '',
            creatorID: initialRecipe?.creatorID || '',
            reviews: initialRecipe?.reviews || [],
            recipeFor: initialRecipe?.recipeFor || ['personal'],
            secret: initialRecipe?.secret || false,
            secretViewerIDs: initialRecipe?.secretViewerIDs || [],
            cookingTime: initialRecipe?.cookingTime || 0,
            createdAt: initialRecipe?.createdAt || '',
            updatedAt: initialRecipe?.updatedAt || '',
        } as IRecipe,
        validate: {
            name: (value) =>
                value ? (value.length > 100 ? 'Invalid name too long' : null) : 'Name cannot be empty',
            description: (value: string) =>
                value ? (value.length > 1000 ? 'Description too long' : null) : 'Description cannot be empty',
            ingredients: (value: IngredientForForm[] | undefined) => {
                if (!value || value.length === 0) return 'At least one ingredient is required';
                for (const ing of value) {
                    if (!ing.ingredient?.trim()) return "Ingredient name can't be empty";
                    if (!ing.quantity?.trim()) return "Ingredient quantity can't be empty";
                }
                return null;
            },
            steps: (value: IStep[] | undefined) => {
                if (!value || value.length === 0) return 'At least one step is required';
                for (const step of value) {
                    if (!step.description?.trim()) return "Step description can't be empty";
                }
                return null;
            },
            secretViewerIDs: (value) => {
                for (const val of value) {
                    if (!/^\S+@\S+$/.test(val)) return 'Invalid email';
                }
                return null;
            }
        }
    });

    const handleCreate = async (redirectPath = '/u/recipes') => {
        if (!userInfo) {
            toast.error("User information is missing");
            return { success: false, message: "User information is missing" };
        }
        const validation = form.validate();
        if (validation.hasErrors) {
            setAttemptedToCreate(true);
            toast.error("Please fix form errors");
            return { success: false };
        }

        const values = form.getValues();
        setLoading(true);

        const result = await CreateRecipe(values, redirectPath);
        setLoading(false);

        if (!result || !result.success || !result.recipeId) {
            toast.error(result.message);
            return result;
        }
        const prevUserRecipeIDs = userInfo.recipeIDs || [];
        setUserInfo({
            ...userInfo,
            recipeIDs: [...prevUserRecipeIDs, result.recipeId]
        });
        toast.success("Recipe created successfully");
        form.reset();
        setAttemptedToCreate(false);
        router.refresh();

        return result;
    };

    const handleUpdate = async (recipeId: string, redirectPath = '/u/recipes') => {
        if (!userInfo) {
            toast.error("User information is missing");
            return { success: false, message: "User information is missing" };
        }
        const validation = form.validate();
        if (validation.hasErrors) {
            setAttemptedToCreate(true);
            toast.error("Please fix form errors");
            return { success: false };
        }

        const values = form.getValues();
        setLoading(true);

        const result = await UpdateRecipe(recipeId, values, redirectPath);
        setLoading(false);

        if (!result.success) {
            toast.error(result.message);
            return result;
        }

        toast.success("Recipe updated successfully");
        form.reset();
        setAttemptedToCreate(false);
        router.refresh();

        return result;
    };

    const handleDelete = async (recipeId: string, redirectPath = '/u/recipes') => {
        if (!userInfo) {
            toast.error("User information is missing");
            return { success: false, message: "User information is missing" };
        }
        const userConfirmed = window.confirm(
            'Are you sure you want to delete this recipe? This action cannot be undone.'
        );

        if (!userConfirmed) {
            toast.info("Cancelled deletion");
            return { success: false };
        }

        setLoading(true);
        const result = await DeleteRecipes([recipeId], redirectPath);
        setLoading(false);

        if (!result.success) {
            toast.error(result.message);
            return result;
        }
        const prevUserRecipeIDs = userInfo.recipeIDs || [];
        setUserInfo({
            ...userInfo,
            recipeIDs: prevUserRecipeIDs.filter(id => id !== recipeId)
        });
        toast.success("Recipe deleted successfully");
        router.refresh();

        return result;
    };

    // might need to implement a save, unsure if I should do both save and favorite

    const favoriteRecipe = async () => {

        setLoading(true);
        if (!userInfo || !initialRecipe) {
            toast.error("User or recipe information is missing");
            setLoading(false);
            return;
        }

        const currUserFavoriteIDs = userInfo.favoriteRecipeIDs || [];
        const willBeFavorited = !isFavorited;

        // Update recipe with correct count
        const updatedRecipe = {
            ...initialRecipe,
            favoriteCount: willBeFavorited
                ? (initialRecipe.favoriteCount || 0) + 1
                : Math.max((initialRecipe.favoriteCount || 0) - 1, 0) // Prevent negative
        } as IRecipe;

        const updatedUser = {
            ...userInfo,
            favoriteRecipeIDs: willBeFavorited
                ? [...currUserFavoriteIDs, initialRecipe._id]
                : currUserFavoriteIDs.filter(id => id !== initialRecipe._id)
        } as IUser;

        try {
            // Update recipe count first
            const updatedRecipeAttempt = await UpdateRecipe(initialRecipe._id, updatedRecipe, pathname);
            if (!updatedRecipeAttempt || !updatedRecipeAttempt.success) {
                console.error("Failed to update recipe:", updatedRecipeAttempt);
                toast.error("Failed to update recipe");
                setLoading(false);
                return;
            }

            // Then update user favorites
            const updatedUserAttempt = await UpdateUser(userInfo._id, updatedUser, pathname);
            if (!updatedUserAttempt || !updatedUserAttempt.success) {
                // Rollback recipe count if user update fails
                await UpdateRecipe(initialRecipe._id, initialRecipe, pathname);
                console.error("Failed to update user:", updatedUserAttempt);
                toast.error("Failed to update favorites");
                setLoading(false);
                return;
            }

            // Update Zustand store
            setUserInfo(updatedUser);
            setIsFavorited(willBeFavorited);

            toast.success(willBeFavorited ? "Recipe added to favorites" : "Recipe removed from favorites");
            router.refresh();
            setLoading(false);

        } catch (error) {
            console.error("Failed to favorite recipe:", error);
            toast.error("Failed to favorite recipe");
            setLoading(false);
        }
    }


    useEffect(() => {
        if (initialRecipe) {
            form.setValues({
                _id: initialRecipe._id || '',
                name: initialRecipe.name || '',
                description: initialRecipe.description || '',
                ingredients: initialRecipe.ingredients || [],
                steps: initialRecipe.steps || [],
                recipeType: initialRecipe.recipeType || '',
                tags: initialRecipe.tags || [],
                image: initialRecipe.image || '',
                creatorID: initialRecipe.creatorID || '',
                reviews: initialRecipe.reviews || [],
                recipeFor: initialRecipe.recipeFor || ['personal'],
                secret: initialRecipe.secret || false,
                secretViewerIDs: initialRecipe.secretViewerIDs || [],
                cookingTime: initialRecipe.cookingTime || 0,
                createdAt: initialRecipe.createdAt || '',
                updatedAt: initialRecipe.updatedAt || '',
            });
        } else {
            form.reset();
        }
    }, [form, initialRecipe]);

    useEffect(() => {
        if (initialRecipe && userInfo && userInfo.favoriteRecipeIDs && userInfo.favoriteRecipeIDs.length > 0) {
            setIsFavorited(userInfo.favoriteRecipeIDs.includes(initialRecipe._id));
        } else {
            setIsFavorited(false);
        }
    }, [initialRecipe, userInfo, initialRecipe?._id, userInfo?.favoriteRecipeIDs]);

    return {
        form,
        loading,
        attemptedToCreate,
        handleCreate,
        handleUpdate,
        handleDelete,
        favoriteRecipe,
        isFavorited,
    };
}
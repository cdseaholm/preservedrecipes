// hooks/recipe/use-recipe-form.ts
'use client'

import { usePathname, useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IngredientForForm } from "@/models/types/recipes/ingredient";
import { IStep } from "@/models/types/recipes/step";
import { IUser } from "@/models/types/personal/user";
import { useUserStore } from "@/context/userStore";
import { CreateRecipe } from "@/utils/server-actions/recipe/create";
import { DeleteRecipes } from "@/utils/server-actions/recipe/delete";
import { ToggleFavoriteRecipe } from "@/utils/server-actions/recipe/favorite";
import { UpdateRecipe } from "@/utils/server-actions/recipe/update";

const getRecipeFormValues = (recipe: IRecipe | null): IRecipe => ({
    _id: recipe?._id || '',
    name: recipe?.name || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || [],
    steps: recipe?.steps || [],
    recipeType: recipe?.recipeType || '',
    tags: recipe?.tags || [],
    image: recipe?.image || '',
    imageKey: recipe?.imageKey || '',
    creatorID: recipe?.creatorID || '',
    reviews: recipe?.reviews || [],
    recipeFor: recipe?.recipeFor || ['personal'],
    secret: recipe?.secret || false,
    secretViewerIDs: recipe?.secretViewerIDs || [],
    cookingTime: recipe?.cookingTime || 0,
    favoriteCount: recipe?.favoriteCount || 0,
    saveCount: recipe?.saveCount || 0,
    createdAt: recipe?.createdAt || '',
    updatedAt: recipe?.updatedAt || '',
});

export function useRecipeForm({ initialRecipe, userInfo }: { initialRecipe: IRecipe | null, userInfo: IUser | null }) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [attemptedToCreate, setAttemptedToCreate] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const pathname = usePathname();
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const initializedRecipeKeyRef = useRef<string | null>(null);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: getRecipeFormValues(initialRecipe),
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
    const formRef = useRef(form);
    formRef.current = form;

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

    const favoriteRecipe = async () => {

        setLoading(true);
        if (!userInfo || !initialRecipe) {
            toast.error("User or recipe information is missing");
            setLoading(false);
            return;
        }

        const currUserFavoriteIDs = userInfo.favoriteRecipeIDs || [];
        const willBeFavorited = !isFavorited;

        try {
            const favoriteAttempt = await ToggleFavoriteRecipe(initialRecipe._id, willBeFavorited, pathname);
            if (!favoriteAttempt || !favoriteAttempt.success) {
                toast.error(favoriteAttempt?.message || "Failed to update favorites");
                setLoading(false);
                return;
            }

            const updatedUser = {
                ...userInfo,
                favoriteRecipeIDs: favoriteAttempt.favorited
                    ? Array.from(new Set([...currUserFavoriteIDs, initialRecipe._id]))
                    : currUserFavoriteIDs.filter(id => id !== initialRecipe._id)
            } as IUser;

            setUserInfo(updatedUser);
            setIsFavorited(favoriteAttempt.favorited);

            toast.success(favoriteAttempt.message);
            router.refresh();
            setLoading(false);

        } catch (error) {
            console.error("Failed to favorite recipe:", error);
            toast.error("Failed to favorite recipe");
            setLoading(false);
        }
    }

    const recipeKey = initialRecipe
        ? `${initialRecipe._id}:${initialRecipe.updatedAt || ''}`
        : 'new-recipe';

    useEffect(() => {
        if (initializedRecipeKeyRef.current === recipeKey) {
            return;
        }

        const initialRecipeValues = getRecipeFormValues(initialRecipe);
        const currentForm = formRef.current;
        initializedRecipeKeyRef.current = recipeKey;
        currentForm.setInitialValues(initialRecipeValues);
        currentForm.setValues(initialRecipeValues);
        currentForm.resetDirty(initialRecipeValues);
        currentForm.resetTouched();
        currentForm.clearErrors();
    }, [recipeKey, initialRecipe]);

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

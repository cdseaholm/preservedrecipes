'use client'

import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { DeleteRecipes } from "@/utils/server-actions/recipe/delete";
import { ToggleFavoriteRecipe } from "@/utils/server-actions/recipe/favorite";
import { ToggleSaveRecipe } from "@/utils/server-actions/recipe/save";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RecipeDetailHooks({ currentUser, recipe, userOwnsRecipe }: { currentUser: IUser | null, recipe: IRecipe, userOwnsRecipe: boolean }) {

    const router = useRouter();
    const pathname = usePathname();
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const { handleOpenRecipeModal } = MenuPanelHooks();

    const [loading, setLoading] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(recipe.favoriteCount || 0);
    const [saveCount, setSaveCount] = useState(recipe.saveCount || 0);
    const [isFavorited, setIsFavorited] = useState(currentUser?.favoriteRecipeIDs?.includes(recipe._id) || false);
    const [isSaved, setIsSaved] = useState(currentUser?.savedRecipeIDs?.includes(recipe._id) || false);

    const requireUser = () => {
        if (currentUser) return true;
        setOpenSignInModal(true);
        return false;
    };

    const updateCurrentUserRecipeList = (field: 'favoriteRecipeIDs' | 'savedRecipeIDs', includeRecipe: boolean) => {
        if (!currentUser) return;
        const currentIds = currentUser[field] || [];
        setUserInfo({
            ...currentUser,
            [field]: includeRecipe
                ? Array.from(new Set([...currentIds, recipe._id]))
                : currentIds.filter(id => id !== recipe._id)
        });
    };

    const handleFavorite = async () => {
        if (!requireUser()) return;
        setLoading(true);
        const result = await ToggleFavoriteRecipe(recipe._id, !isFavorited, pathname);
        setLoading(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setIsFavorited(result.favorited);
        setFavoriteCount(result.favoriteCount);
        updateCurrentUserRecipeList('favoriteRecipeIDs', result.favorited);
        toast.success(result.message);
        router.refresh();
    };

    const handleSave = async () => {
        if (!requireUser()) return;
        setLoading(true);
        const result = await ToggleSaveRecipe(recipe._id, !isSaved, pathname);
        setLoading(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setIsSaved(result.saved);
        setSaveCount(result.saveCount);
        updateCurrentUserRecipeList('savedRecipeIDs', result.saved);
        toast.success(result.message);
        router.refresh();
    };

    const handleEdit = async () => {
        if (!currentUser) return;
        await handleOpenRecipeModal(recipe, currentUser, 'personal');
    };

    const handleDelete = async () => {
        if (!currentUser || !userOwnsRecipe) return;
        const confirmed = window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.');
        if (!confirmed) return;

        setLoading(true);
        const result = await DeleteRecipes([recipe._id], pathname);
        setLoading(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setIsNavigating(true);
        router.push('/u/recipes');
    };

    return {
        requireUser,
        updateCurrentUserRecipeList,
        handleFavorite,
        handleSave,
        handleEdit,
        handleDelete,
        loading,
        favoriteCount,
        saveCount,
        isFavorited,
        isSaved
    }
}

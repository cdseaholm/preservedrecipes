// hooks/recipe/use-recipe-list.ts
'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IRecipe } from "@/models/types/recipes/recipe";
import { AddRecipeToFamily, DeleteRecipes, RemoveRecipesFromFamily } from "@/utils/server-actions/recipe";
import { IUser } from "@/models/types/personal/user";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IFamily } from "@/models/types/family/family";

export function useRecipeList(allMixedRecipes: IRecipe[], userInfo: IUser | null, route: string, ingredients: IIngredient[], family: IFamily | null) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [checkedRecipes, setCheckedRecipes] = useState<Set<string>>(new Set());
    const [openFilter, setOpenFilter] = useState(false);
    const [openSort, setOpenSort] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);
    const [recipeSearch, setRecipeSearch] = useState('');
    const [ingredientNames, setIngredientNames] = useState<IIngredient[]>(ingredients || []);
    const [openChooseRecipe, setOpenChooseRecipe] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const handleModalLoading = (loading: boolean) => { 
        setModalLoading(loading);
    }

    const filteredAndSorted = allMixedRecipes.filter(recipe => {
            // Apply filter
            if (filter === 'secret') return recipe.secret;
            if (filter === 'non_secret') return !recipe.secret;
            if (filter === 'three_stars_plus') {
                const avgRating = recipe.reviews.reduce((acc, r) => acc + (r.rating ? r.rating : 0), 0) / recipe.reviews.length;
                return avgRating >= 3;
            }
            if (filter === 'five_stars') {
                const avgRating = recipe.reviews.reduce((acc, r) => acc + (r.rating ? r.rating : 0), 0) / recipe.reviews.length;
                return avgRating === 5;
            }
            if (filter === 'favorites' && userInfo) return userInfo.favoriteRecipeIDs?.includes(recipe._id);
            if (filter === 'saved' && userInfo) return userInfo.savedRecipeIDs?.includes(recipe._id);
            if (filter === 'my_recipes' && userInfo) return recipe.creatorID === userInfo._id;
            return true;
        })
        .filter(recipe =>
            // Apply search
            recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
        )
        .sort((a, b) => {
            // Apply sort
            if (sort === 'name_asc') return a.name.localeCompare(b.name);
            if (sort === 'name_desc' || sort === null) return b.name.localeCompare(a.name);
            if (sort === 'createdAt_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sort === 'createdAt_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return 0;
        });

    const toggleChecked = (recipeId: string) => {
        setCheckedRecipes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(recipeId)) {
                newSet.delete(recipeId);
            } else {
                newSet.add(recipeId);
            }
            return newSet;
        });
    };

    const toggleEdit = () => {
        setOpenFilter(false);
        setOpenSort(false);
        setEdit(!edit);
        if (edit) {
            setCheckedRecipes(new Set());
        }
    };

    const checkAll = () => {
        if (checkedRecipes.size === filteredAndSorted.length) {
            setCheckedRecipes(new Set());
        } else {
            setCheckedRecipes(new Set(filteredAndSorted.map(recipe => recipe._id)));
        }
    };

    const toggleFilter = () => {
        setEdit(false);
        setOpenFilter(!openFilter);
    };

    const toggleSort = () => {
        setEdit(false);
        setOpenSort(!openSort);
    };

    const handleFilter = (newFilter: string | null) => {
        setFilter(newFilter);
        setOpenFilter(false);
    }

    const handleSort = (newSort: string | null) => {

        setSort(newSort);
        setOpenSort(false);

    }

    const handleBulkDelete = async () => {
        setLoading(true);
        const itemsToDelete = Array.from(checkedRecipes);

        if (itemsToDelete.length === 0) {
            toast.info('No recipes selected');
            setLoading(false);
            return;
        }

        const userConfirmed = window.confirm(
            `Are you sure you want to delete ${itemsToDelete.length} recipe(s)?`
        );

        if (!userConfirmed) {
            toast.info('Cancelled deletion');
            setLoading(false);
            return;
        }

        const result = await DeleteRecipes(itemsToDelete, route);

        if (result.success) {
            toast.success(result.message);
            setEdit(false);
            setCheckedRecipes(new Set());
            router.refresh();
        } else {
            toast.error(result.message);
            setLoading(false);
        }
    };

    const handleBulkRemoveFromFamily = async () => {
        handleModalLoading(true);
        const itemsToRemove = Array.from(checkedRecipes);

        if (itemsToRemove.length === 0) {
            toast.info('No recipes selected');
            handleModalLoading(false);
            return;
        }

        const userConfirmed = window.confirm(
            `Are you sure you want to remove ${itemsToRemove.length} recipe(s) from the family?`
        );

        if (!userConfirmed) {
            toast.info('Cancelled removal');
            handleModalLoading(false);
            return;
        }

        if (!family) {
            toast.error('Family data is not available');
            handleModalLoading(false);
            return;
        }

        const result = await RemoveRecipesFromFamily(itemsToRemove, family._id, route);

        if (result.success) {
            toast.success(result.message);
            setEdit(false);
            setCheckedRecipes(new Set());
            router.refresh();
        } else {
            toast.error(result.message);
            handleModalLoading(false);
        }
    };

    const toggleChooseRecipe = () => {
        setOpenChooseRecipe(!openChooseRecipe);
    };

    const handleAddRecipe = async (recipe: IRecipe) => {
        handleModalLoading(true);
        if (!recipe) {
            toast.error('No recipe selected');
            handleModalLoading(false);
            return;
        }
        if (!family) {
            toast.error('No family selected');
            handleModalLoading(false);
            return;
        }
        if (!route) {
            toast.error('Route is not defined');
            handleModalLoading(false);
            return;
        }
        if (family.recipeIDs.includes(recipe._id)) {
            toast.error('Recipe is already in the family');
            handleModalLoading(false);
            return;
        }
        const addAttempt = await AddRecipeToFamily(recipe._id, family._id, route);
        if (!addAttempt) {
            toast.error('Failed to add recipe to family');
            handleModalLoading(false);
            return;
        } 
        if (!addAttempt.success) {
            toast.error(addAttempt.message);
            handleModalLoading(false);
            return;
        }
        if (addAttempt.success) {
            router.refresh();
        }
    };

    useEffect(() => {
        if (ingredients) {
            setIngredientNames(ingredients);
        }
    }, [ingredients, setIngredientNames]);

    return {
        // State
        edit,
        checkedRecipes,
        openFilter,
        openSort,
        filter,
        sort,
        recipeSearch,
        filteredAndSorted,

        // Setters
        handleFilter,
        handleSort,
        setRecipeSearch,

        // Actions
        toggleChecked,
        toggleEdit,
        toggleFilter,
        toggleSort,
        handleBulkRemoveFromFamily,
        checkAll,
        ingredientNames,
        openChooseRecipe,
        toggleChooseRecipe,
        handleAddRecipe,
        modalLoading,
        handleBulkDelete,
        loading
    };
}
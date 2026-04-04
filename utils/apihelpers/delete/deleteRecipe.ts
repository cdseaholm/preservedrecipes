import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/personal/user";
import { toast } from "sonner";
import { HelperResponse } from "./deleteUser";
import { IRecipe } from "@/models/types/recipes/recipe";
import { useFamilyStore } from "@/context/familyStore";

export default async function AttemptDeleteRecipes({ toDelete }: { toDelete: string[] }, headers: HeadersInit): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/recipe/delete`;

    if (toDelete.length === 0) {
        toast.info('No recipes selected for deletion');
        return { status: false, message: 'No recipes selected for deletion' };
    }

    if (!baseUrl || baseUrl === '') {
        toast.error('No base URL configured');
        return { status: false, message: 'No base URL configured' };
    }

    try {
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
            },
            body: JSON.stringify({ itemsToDelete: toDelete }),
        });

        if (!response.ok) {
            toast.error('Failed to delete recipes');
            return { status: false, message: 'Failed to delete recipes' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to delete recipes, data null' };
        }

        if (data.status !== 200) {
            toast.error(`Failed to delete recipes: ${data.message}`);
            return { status: false, message: `Failed to delete recipes: ${data.message}` };
        }

        const recipes = useUserStore.getState().userRecipes as IRecipe[];
        const updatedItems = recipes.filter((recipe) => !toDelete.includes(recipe._id));
        useUserStore.getState().setUserRecipes(updatedItems as IRecipe[]);
        const userInfo = useUserStore.getState().userInfo;
        const newUserInfo = {
            ...userInfo,
            recipeIDs: userInfo.recipeIDs.filter((id) => !toDelete.includes(id))
        } as IUser
        useUserStore.getState().setUserInfo(newUserInfo);

        const family = useFamilyStore.getState().family;
        const familyRecipes = useFamilyStore.getState().familyRecipes;

        if (family && familyRecipes) {
            const updatedFamilyRecipes = familyRecipes.filter((recipe) => !toDelete.includes(recipe._id));
            useFamilyStore.getState().setFamilyRecipes(updatedFamilyRecipes);
            const newFamilyInfo = {
                ...family,
                recipeIDs: family.recipeIDs.filter((id) => !toDelete.includes(id))
            }
            useFamilyStore.getState().setFamily(newFamilyInfo);
        }

        toast.success('Recipes deleted successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error deleting Recipes');
        return { status: false, message: 'Error deleting Recipes' };
    }
}
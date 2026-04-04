
import { toast } from "sonner";
import { HelperResponse } from "./deleteUser";
import { useFamilyStore } from "@/context/familyStore";

export default async function AttemptRemoveFamilyRecipes({ toDelete, familyID }: { toDelete: string[], familyID: string }, headers: HeadersInit): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/family/recipes/delete`;

    if (toDelete.length === 0) {
        toast.info('No recipes selected for removal');
        return { status: false, message: 'No recipes selected for removal' };
    }

    if (!baseUrl || baseUrl === '') {
        toast.error('No base URL configured');
        return { status: false, message: 'No base URL configured' };
    }

    if (!familyID || familyID === '') {
        toast.error('No family ID configured');
        return { status: false, message: 'No family ID configured' };
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
            body: JSON.stringify({ itemsToDelete: toDelete, familyID: familyID }),
        });

        if (!response.ok) {
            toast.error('Failed to remove recipes');
            return { status: false, message: 'Failed to remove recipes' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to remove recipes, data null' };
        }

        if (data.status !== 200) {
            toast.error(`Failed to remove recipes: ${data.message}`);
            return { status: false, message: `Failed to remove recipes: ${data.message}` };
        }

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

        toast.success('Family Recipes removed successfully');

        return { status: true, message: 'Family Recipes removed successfully' };

    } catch (error) {
        toast.error('Error removing Family Recipes');
        return { status: false, message: 'Error removing Family Recipes' };
    }
}
import { useUserStore } from "@/context/userStore";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";
import { toast } from "sonner";
import { DeleteResponse } from "./deleteUser";

export default async function AttemptDeleteRecipes({ toDelete }: { toDelete: IRecipe[] }, headers: HeadersInit): Promise<DeleteResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/recipe/delete`;

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

        const recipes = useUserStore.getState().userRecipes as IRecipe[];
        const toDeleteIDs = new Set(toDelete.map((deletion) => deletion._id));
        const updatedItems = recipes.filter((recipe) => !toDeleteIDs.has(recipe._id));

        useUserStore.getState().setUserRecipes(updatedItems as IRecipe[]);
        const userInfo = useUserStore.getState().userInfo;
        const newUserInfo = {
            ...userInfo,
            recipeIDs: userInfo.recipeIDs.filter((id) => !toDeleteIDs.has(id))
        } as IUser
        useUserStore.getState().setUserInfo(newUserInfo);

        toast.success('Recipes deleted successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error deleting recipes');
        return { status: false, message: 'Error deleting recipes' };
    }
}
import { useUserStore } from "@/context/userStore";
import { IRecipe } from "@/models/types/recipe";
import { toast } from "sonner";

interface DeleteResponse {
    status: boolean;
    message: string;
    updatedItems?: IRecipe[];
}

async function deleteRecipes(toDelete: IRecipe[], headers: HeadersInit): Promise<DeleteResponse> {
    const baseUrl = process.env.BASE_URL ? process.env.BASE_URL as string : '';
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

        const updatedItems = data.updatedItems;

        useUserStore.getState().setUserRecipes(updatedItems);

        toast.success('Recipes deleted successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        console.error('Error deleting recipes:', error);
        toast.error('Error deleting recipes');
        return { status: false, message: 'Error deleting recipes' };
    }
}


export default async function AttemptDelete({ which, toDelete }: { which: string, toDelete: IRecipe[] }, headers: HeadersInit): Promise<DeleteResponse> {
    switch (which) {
        case 'recipes':
            return await deleteRecipes(toDelete, headers);
        // Add more cases here for different types of deletions
        default:
            return { status: false, message: 'Invalid delete type' };
    }
}
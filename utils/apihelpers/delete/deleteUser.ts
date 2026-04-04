import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { ICommunity } from "@/models/types/community/community";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { toast } from "sonner";

export interface HelperResponse {
    status: boolean;
    message: string;
}

export default async function AttemptDeleteUser(headers: HeadersInit): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    if (!baseUrl || baseUrl.length === 0 || baseUrl === '') {
        toast.error('Base URL not defined');
        return { status: false, message: 'Base URL not defined' };
    }
    const urlToDelete = `${baseUrl}/api/user/delete`;

    try {
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            toast.error('Failed to delete user');
            return { status: false, message: 'Failed to delete user' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to delete user, data null' };
        }

        useUserStore.getState().setUserRecipes([] as IRecipe[]);
        useUserStore.getState().setUserCommunities([] as ICommunity[]);
        useUserStore.getState().setUserInfo({} as IUser);
        //useUserStore.getState().setSuggestions([] as ISuggestion[]);
        useFamilyStore.getState().setFamily({} as IFamily);

        toast.success('User deleted successfully');

        return { status: true, message: 'User deleted successfully' };

    } catch (error) {
        toast.error('Error deleting user');
        return { status: false, message: 'Error deleting user' };
    }
}
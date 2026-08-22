import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { ICommunity } from "@/models/types/community/community";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { toast } from "sonner";
import { readApiResponse } from "../api-response";

export interface HelperResponse {
    status: boolean;
    message: string;
}

export default async function AttemptDeleteUser(headers: HeadersInit): Promise<HelperResponse> {
    try {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        });

        const apiResponse = await readApiResponse(response, 'Failed to delete user');
        if (!apiResponse.status) {
            toast.error(apiResponse.message);
            return { status: false, message: apiResponse.message };
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

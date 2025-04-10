import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { toast } from "sonner";

export interface HelperResponse {
    status: boolean;
    message: string;
}

export default async function AttemptDeleteUser(headers: HeadersInit): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/user/delete`;

    try {
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
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

        useUserStore.getState().setUserRecipes(useUserStore.getInitialState().userRecipes);
        useUserStore.getState().setUserCommunities(useUserStore.getInitialState().userCommunities);
        useUserStore.getState().setUserInfo(useUserStore.getInitialState().userInfo);
        useFamilyStore.getState().setFamily(useFamilyStore.getInitialState().family);

        toast.success('Recipes deleted successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error deleting user');
        return { status: false, message: 'Error deleting user' };
    }
}
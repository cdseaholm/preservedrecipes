import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IUser } from "@/models/types/user";
import { toast } from "sonner";
import { HelperResponse } from "./deleteUser";

export default async function AttemptDeleteFamily({ toDelete }: { toDelete: IFamily }, headers: HeadersInit): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/family/delete`;

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
            toast.error('Failed to delete family');
            return { status: false, message: 'Failed to delete family' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to delete family, data null' };
        }

        useFamilyStore.getState().setFamily({} as IFamily);

        const userInfo = useUserStore.getState().userInfo;

        const newUserInfo = {
            ...userInfo,
            userFamilyID: '',
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);

        toast.success('Recipes deleted successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error deleting family');
        return { status: false, message: 'Error deleting family' };
    }
}
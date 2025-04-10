import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/user";
import { toast } from "sonner";

export async function EditDetails({ which, toEdit }: { which: string, toEdit: string }, headers: HeadersInit) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/user/edit`;

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
            body: JSON.stringify({ itemToEdit: toEdit, which: which }),
        });

        if (!response.ok) {
            toast.error('Failed to edit user');
            return { status: false, message: 'Failed to edit user' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to edit user, data null' };
        }

        const userInfo = useUserStore.getState().userInfo;

        if (which === 'name') {
            const newUserInfo = {
                ...userInfo,
                name: toEdit
            } as IUser;
            useUserStore.getState().setUserInfo(newUserInfo);
        } else {
            const newUserInfo = {
                ...userInfo,
                email: toEdit
            } as IUser;
            useUserStore.getState().setUserInfo(newUserInfo);
        }

        toast.success('User edited successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error editing user');
        return { status: false, message: 'Error editing user' };
    }
}
import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/personal/user";
import { toast } from "sonner";

export async function EditDetails({ which, toEdit, passwordEntered }: { which: 'name' | 'email' | 'password', toEdit: string, passwordEntered: string }, headers: HeadersInit) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToEdit = `${baseUrl}/api/user/edit`;

    if (!baseUrl || baseUrl.length === 0 || baseUrl === '') {
        toast.error('Base URL not defined');
        return { status: false, message: 'Base URL not defined' };
    }

    if (!which || !toEdit || !passwordEntered) {
        toast.error('Missing parameters for editing user');
        return { status: false, message: 'Missing parameters for editing user' };
    }

    try {
        const response = await fetch(urlToEdit, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemToEdit: toEdit, which: which, passwordEntered: passwordEntered }),
        });

        if (!response.ok) {
            toast.error('Failed to edit user');
            return { status: false, message: 'Failed to edit user' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to edit user, data null' };
        }

        if (data.status !== 200) {
            toast.error('Error editing user: ' + data.message);
            return { status: false, message: 'Error editing user: ' + data.message };
        }

        const userInfo = useUserStore.getState().userInfo;

        if (which === 'name') {
            const newUserInfo = {
                ...userInfo,
                name: toEdit
            } as IUser;
            useUserStore.getState().setUserInfo(newUserInfo);
        } else if (which === 'email') {
            const newUserInfo = {
                ...userInfo,
                email: toEdit
            } as IUser;
            useUserStore.getState().setUserInfo(newUserInfo);
        }

        toast.success('User edited successfully');

        return { status: true, message: 'User edited successfully' };

    } catch (error) {
        toast.error('Error editing user');
        return { status: false, message: 'Error editing user' };
    }
}
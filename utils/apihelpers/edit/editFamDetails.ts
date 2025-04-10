import { useFamilyStore } from "@/context/familyStore";
import { IFamily } from "@/models/types/family";
import { toast } from "sonner";

export async function EditFamDetails({ famId, newName }: { famId: string, newName: string }, headers: HeadersInit) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/family/edit`;

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
            body: JSON.stringify({ newName: newName, famId: famId }),
        });

        if (!response.ok) {
            toast.error('Failed to edit user');
            return { status: false, message: 'Failed to edit user' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to edit user, data null' };
        }

        const famInfo = useFamilyStore.getState().family;

        const newFamInfo = {
            ...famInfo,
            name: newName
        } as IFamily;
        useFamilyStore.getState().setFamily(newFamInfo);


        toast.success('User edited successfully');

        return { status: true, message: 'Recipes deleted successfully' };

    } catch (error) {
        toast.error('Error editing user');
        return { status: false, message: 'Error editing user' };
    }
}
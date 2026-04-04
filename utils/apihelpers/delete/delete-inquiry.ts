import { useUserStore } from "@/context/userStore";
import { toast } from "sonner";
import { HelperResponse } from "./deleteUser";
import { IInquiry } from "@/models/types/misc/inquiry";

export default async function AttemptDeleteInquiry({ toDelete }: { toDelete: IInquiry[] }): Promise<HelperResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!baseUrl || baseUrl.length === 0 || baseUrl === '') {
        return { status: false, message: 'Failed to delete inquiry, No URL' };
    }

    const urlToDelete = `${baseUrl}/api/inquiry/delete`;

    if (!toDelete || !toDelete.length || toDelete.length === 0) {
        return { status: false, message: 'No inquiry to delete' };
    }

    try {
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
            },
            body: JSON.stringify({ itemsToDelete: toDelete }),
        });

        if (!response.ok) {
            toast.error('Failed to delete inquiry');
            return { status: false, message: 'Failed to delete inquiry' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to delete inquiry, data null' };
        }

        if (data.status !== 200) {
            toast.error('Failed to delete inquiry');
            return { status: false, message: 'Failed to delete inquiry' };
        }

        const currInquirys = useUserStore.getState().inquiries || [];
        const newInquirys = currInquirys.filter(inq => !toDelete.some(del => del._id === inq._id));

        useUserStore.getState().setInquiries([...newInquirys]);

        return { status: true, message: 'Inquirys deleted successfully' };

    } catch (error) {
        toast.error('Error deleting inquiry');
        return { status: false, message: 'Error deleting inquiry' };
    }
}
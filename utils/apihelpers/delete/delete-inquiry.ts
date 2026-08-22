import { useUserStore } from "@/context/userStore";
import { HelperResponse } from "./deleteUser";
import { IInquiry } from "@/models/types/misc/inquiry";
import { readApiResponse } from "../api-response";

export default async function AttemptDeleteInquiry({ toDelete }: { toDelete: IInquiry[] }): Promise<HelperResponse> {
    if (!toDelete || !toDelete.length || toDelete.length === 0) {
        return { status: false, message: 'No inquiry to delete' };
    }

    try {
        const response = await fetch('/api/inquiry/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
            },
            body: JSON.stringify({ itemsToDelete: toDelete }),
        });

        const apiResponse = await readApiResponse(response, 'Failed to delete inquiry');
        if (!apiResponse.status) return { status: false, message: apiResponse.message };

        const currInquirys = useUserStore.getState().inquiries || [];
        const newInquirys = currInquirys.filter(inq => !toDelete.some(del => del._id === inq._id));

        useUserStore.getState().setInquiries([...newInquirys]);

        return { status: true, message: 'Inquirys deleted successfully' };

    } catch (error) {
        return { status: false, message: 'Error deleting inquiry' };
    }
}

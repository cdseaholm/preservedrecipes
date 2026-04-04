import { useCommunityStore } from "@/context/communityStore";
import { ICommunity } from "@/models/types/community/community";
import { toast } from "sonner";

export async function EditCommunity({ updatedCommunity }: { updatedCommunity: ICommunity }, headers: HeadersInit) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToEdit = `${baseUrl}/api/community/edit`;

    if (!baseUrl || baseUrl.length === 0 || baseUrl === '') {
        toast.error('Base URL not defined');
        return { status: false, message: 'Base URL not defined' };
    }

    if (!updatedCommunity) {
        toast.error('Missing parameters for editing community');
        return { status: false, message: 'Missing parameters for editing community' };
    }

    try {
        const response = await fetch(urlToEdit, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemToEdit: updatedCommunity }),
        });

        if (!response.ok) {
            toast.error('Failed to edit community');
            return { status: false, message: 'Failed to edit community' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to edit community, data null' };
        }

        if (data.status !== 200) {
            toast.error('Error editing community: ' + data.message);
            return { status: false, message: 'Error editing community: ' + data.message };
        }

        const communityInfo = useCommunityStore.getState().community;

        if (communityInfo && communityInfo._id === updatedCommunity._id) {
            useCommunityStore.getState().setCommunity(updatedCommunity);
        }

        toast.success('Community edited successfully');

        return { status: true, message: 'Community edited successfully' };

    } catch (error) {
        toast.error('Error editing community');
        return { status: false, message: 'Error editing community' };
    }
}
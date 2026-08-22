import { readApiResponse } from "../api-response";

export async function AttemptDeleteCommunity(communityID: string) {
    if (!communityID || communityID === '') {
        return { status: false, message: 'Failed to delete community, No Community ID' };
    }

    try {
        const res = await fetch('/api/community/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsToDelete: communityID })
        });
        const apiResponse = await readApiResponse(res, 'Failed to delete community');
        if (!apiResponse.status) return { status: false, message: apiResponse.message };

        return { status: true, message: 'Community deleted successfully' };
    } catch (error) {
        return { status: false, message: 'Failed to delete community, unexpected error' };
    }
}

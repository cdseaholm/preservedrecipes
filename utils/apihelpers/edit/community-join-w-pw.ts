import { readApiResponse } from "../api-response";

export async function CommunityJoinWithPassword({ communityID, password }: { communityID: string; password: string; }) {

    if (!communityID || communityID === '') {
        return { status: false, message: 'Community ID is required' };
    }

    if (password === '' || !password) {
        return { status: false, message: 'Password protected communities must have a password' };
    }

    try {
        const res = await fetch('/api/community/join/pw', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ communityID, password })
        });

        const apiResponse = await readApiResponse(res, 'Failed to join community');
        if (!apiResponse.status) return { status: false, message: apiResponse.message };

        return { status: true, message: `User added to community` };

    } catch (error: any) {
        return { status: false, message: `Failed to join community` };
    }

}

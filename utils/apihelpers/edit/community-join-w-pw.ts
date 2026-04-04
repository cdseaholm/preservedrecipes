export async function CommunityJoinWithPassword({ communityID, password }: { communityID: string; password: string; }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: 'Failed Joining Community, No URL' };
    }

    if (!communityID || communityID === '') {
        return { status: false, message: 'Failed Joining Community, No Community ID' };
    }

    if (password === '' || !password) {
        return { status: false, message: 'Failed Joining Community, Private communities must have a password' };
    }

    try {
        const res = await fetch(`${urlToUse}/api/community/join/pw`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ communityID, password })
        });

        if (!res.ok) {
            return { status: false, message: `Failed to add user to community, ${res.statusText}` };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed to add user to community, Invalid JSON response` };
        }

        if (data.status !== 200) {
            return { status: false, message: `Failed to add user to community, ${data.message}` };
        }

        return { status: true, message: `User added to community` };

    } catch (error: any) {
        return { status: false, message: `Failed to add user to community` };
    }

}
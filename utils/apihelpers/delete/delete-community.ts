export async function AttemptDeleteCommunity(communityID: string) {
    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: 'Failed to delete community, No URL' };
    }

    if (!communityID || communityID === '') {
        return { status: false, message: 'Failed to delete community, No Community ID' };
    }

    try {
        const res = await fetch(`${urlToUse}/api/community/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsToDelete: communityID })
        });
        const data = await res.json();
        if (!res.ok) {
            return { status: false, message: data.message || 'Failed to delete community' };
        }
        return { status: true, message: 'Community deleted successfully' };
    } catch (error) {
        return { status: false, message: 'Failed to delete community, unexpected error' };
    }
}
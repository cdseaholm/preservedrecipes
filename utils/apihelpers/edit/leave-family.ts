export async function LeaveFamily({ famid, userid }: { famid: string, userid: string }) {
    try {
        const response = await fetch(`/api/family/members/leave`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ famid, userid }),
        });
        if (!response.ok) {
            throw new Error('Failed to leave family');
        }
        return await response.json();
    } catch (error) {
        console.error('Error leaving family:', error);
        throw error;
    }
}
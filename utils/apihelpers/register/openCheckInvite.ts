import { useFamilyStore } from "@/context/familyStore";
import { IInvite } from "@/models/types/invite";
import { IUser } from "@/models/types/user";
import { toast } from "sonner";

export async function OpenInvite({ token }: { token: string | string[] }) {

    const urlToUse = process.env.BASE_URL ? process.env.BASE_URL as string : '';

    if (urlToUse === '' || token === '') {
        return { status: false, message: urlToUse === '' ? 'Issue with url' : 'Issue with token', invite: {} as IInvite, userExists: false };
    }

    try {
        const inviteRes = await fetch(`${urlToUse}/api/invite/open`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token }),
        });

        if (!inviteRes.ok) {
            toast.error('Failed to delete family');
            return { status: false, message: 'Failed to fetch invite, res', invite: {} as IInvite, userExists: false };
        }

        const data = await inviteRes.json();

        if (!data) {
            return { status: false, message: 'Failed to fetch invite, data null', invite: {} as IInvite, userExists: false };
        }

        if (data && data.status !== 200) {
            return { status: false, message: `Failed to fetch invite, status: ${data.status}`, invite: {} as IInvite, userExists: false };
        }

        useFamilyStore.getState().setInvite(data.inviteReturned as IInvite)
        return { status: true, message: 'Completed opening invite', invite: data.inviteReturned as IInvite, userExists: data.userExists as IUser }


    } catch (error: any) {
        console.log(error);
        return { status: false, message: error, invite: {} as IInvite, userExists: false };
    }

}
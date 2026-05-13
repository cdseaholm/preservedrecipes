import { useFamilyStore } from "@/context/familyStore";
import { IInvite } from "@/models/types/misc/invite";
import { IUser } from "@/models/types/personal/user";
import { readApiResponse } from "../api-response";

export async function OpenInvite({ token }: { token: string }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (urlToUse === '' || token === '') {
        return { status: false, message: urlToUse === '' ? 'Issue with url' : 'Issue with token', invite: {} as IInvite, userExists: false };
    }

    try {
        const inviteRes = await fetch(`${urlToUse}/api/invite/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const apiResponse = await readApiResponse<{ inviteReturned?: IInvite; userExists?: IUser | boolean }>(inviteRes, 'Failed to fetch invite');
        if (!apiResponse.status || !apiResponse.data) {
            return { status: false, message: apiResponse.message, invite: {} as IInvite, userExists: false };
        }

        useFamilyStore.getState().setInvite(apiResponse.data.inviteReturned as IInvite)
        return { status: true, message: 'Completed opening invite', invite: apiResponse.data.inviteReturned as IInvite, userExists: apiResponse.data.userExists as IUser }


    } catch (error: any) {
        return { status: false, message: 'Failed to fetch invite', invite: {} as IInvite, userExists: false };
    }

}

import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IInvite } from "@/models/types/misc/invite";
import { readApiResponse } from "../api-response";

export async function InviteRegCheck({ invite }: { invite: IInvite }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (urlToUse === '') {
        return { status: false }
    }

    try {
        const response = await fetch(`${urlToUse}/api/invite/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: invite.token }),
        });

        const apiResponse = await readApiResponse<{ returnedMembers?: IFamilyMember[] }>(response, 'Failed to accept invite');
        if (!apiResponse.status || !apiResponse.data) return { status: false, message: apiResponse.message };

        const returnedMembers = apiResponse.data.returnedMembers as IFamilyMember[];

        useFamilyStore.getState().setInvite(null);

        const userInfo = useUserStore.getState().userInfo;
        useUserStore.getState().setUserInfo({
            ...userInfo,
            userFamilyID: invite.familyID
        });

        const fam = useFamilyStore.getState().family;
        useFamilyStore.getState().setFamily({
            ...fam,
            familyMembers: returnedMembers
        });

        return { status: true, message: 'Invite accepted successfully' };

    } catch (error) {
        return { status: false, message: 'Error accepting invite' };
    }
}

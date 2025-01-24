import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamilyMember } from "@/models/types/familyMember";
import { IInvite } from "@/models/types/invite";

export async function InviteRegCheck({ invite }: { invite: IInvite }) {

    const urlToUse = process.env.BASE_URL ? process.env.BASE_URL as string : '';

    if (urlToUse === '') {
        return { status: false }
    }

    try {
        const response = await fetch(`${urlToUse}/api/invite/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ invite: invite }),
        });

        if (!response.ok) {
            return { status: false, message: 'Failed to recieve invite response' };
        }

        const data = await response.json();

        if (!data || data.status !== 200) {
            return { status: false, message: 'Failed to recieve invite, data null' };
        }

        const returnedMembers = data.returnedMembers as IFamilyMember[];

        useFamilyStore.getState().setInvite(useFamilyStore.getInitialState().invite);

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

        return { status: true, message: 'Invite opened and recieved successfully' };

    } catch (error) {
        return { status: false, message: 'Error recieving invite' };
    }
}
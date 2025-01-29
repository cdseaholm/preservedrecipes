
import { NewFamMemFormType } from "@/components/forms/addFamMemForm";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/familyMember";

export async function SendInvites({ emails, familyId }: { emails: NewFamMemFormType, familyId: string }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (urlToUse === '') {
        return { status: false, message: 'Need url' }
    }

    if (familyId === '') {
        return { status: false, message: 'Need family' }
    }

    try {
        const response = await fetch(`${urlToUse}/api/invite/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails: emails, familyId: familyId }),
        });

        if (!response.ok) {
            return { status: false, message: 'Failed to receive sentInvite response' };
        }

        const data = await response.json();

        if (!data || data.status !== 200) {
            return { status: false, message: 'Failed to receive sentInvite, data null' };
        }

        const returnedMembers = data.famMembersReturned as IFamilyMember[];

        const fam = useFamilyStore.getState().family;
        useFamilyStore.getState().setFamily({
            ...fam,
            familyMembers: returnedMembers
        });

        return { status: true, message: 'Invites sent' };

    } catch (error) {
        return { status: false, message: 'Error sending invites' };
    }
}
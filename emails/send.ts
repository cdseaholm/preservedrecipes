

import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { NewFamMemFormType } from "@/models/types/family/new-fam";

type InviteResponse = {
    status?: number;
    message?: string;
    famMembersReturned?: IFamilyMember[];
};

export async function SendInvites({ emails, familyId }: { emails: NewFamMemFormType, familyId: string }) {
    if (familyId === '') {
        return { status: false, message: 'Need family' }
    }

    try {
        const response = await fetch('/api/invite/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails: emails, familyId: familyId }),
        });

        const data = await response.json().catch(() => null) as InviteResponse | null;

        if (!response.ok || !data) {
            const message = data?.message || 'Failed to send invites';
            console.error('[SendInvites] invite/send failed', {
                httpStatus: response.status,
                message,
                response: data,
            });
            return { status: false, message };
        }

        const returnedMembers = data.famMembersReturned;

        if (!Array.isArray(returnedMembers)) {
            console.error('[SendInvites] invite/send missing members', data);
            return { status: false, message: data.message || 'Invite response did not include updated family members' };
        }

        const fam = useFamilyStore.getState().family;
        useFamilyStore.getState().setFamily({
            ...fam,
            familyMembers: returnedMembers
        });

        return { status: true, message: data.message || 'Invites sent' };

    } catch (error) {
        console.error('[SendInvites] request failed', error);
        return { status: false, message: 'Error sending invites' };
    }
}

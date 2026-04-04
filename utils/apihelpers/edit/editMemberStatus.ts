
import { useFamilyStore } from "@/context/familyStore";
import { IFamily } from "@/models/types/family/family";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { toast } from "sonner";

export async function EditMemberStatus({ membersToChange, famId }: { membersToChange: IFamilyMember[], famId: string }, headers: HeadersInit) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/family/edit`;

    try {
        const response = await fetch(urlToDelete, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
            },
            body: JSON.stringify({ membersToChange: membersToChange, famId: famId }),
        });

        if (!response.ok) {
            toast.error('Failed to edit member status');
            return { status: false, message: 'Failed to edit member status' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to edit member status, data null' };
        }

        const famInfo = useFamilyStore.getState().family;
        const returnedMembers = data.returnedMembers as IFamilyMember[];

        const newFamInfo = {
            ...famInfo,
            familyMembers: returnedMembers
        } as IFamily;
        useFamilyStore.getState().setFamily(newFamInfo);

        toast.success('Member status edited successfully');

        return { status: true, message: `Members status' updated successfully` };

    } catch (error) {
        toast.error('Error editing member status');
        return { status: false, message: 'Error editing member status' };
    }
}
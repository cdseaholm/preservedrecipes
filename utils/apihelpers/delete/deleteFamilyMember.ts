import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IUser } from "@/models/types/user";
import { toast } from "sonner";
import { DeleteResponse } from "./deleteUser";
import { IFamilyMember } from "@/models/types/familyMember";

export default async function AttemptDeleteFamilyMember({ toDelete, adminToRemove }: { toDelete: IFamilyMember[], adminToRemove: boolean }, headers: HeadersInit): Promise<DeleteResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const urlToDelete = `${baseUrl}/api/family/members/delete`;

    try {
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 6000
            },
            body: JSON.stringify({ itemsToDelete: toDelete }),
        });

        if (!response.ok) {
            toast.error('Failed to remove members');
            return { status: false, message: 'Failed to remove members' };
        }

        const data = await response.json();

        if (!data) {
            return { status: false, message: 'Failed to remove members, data null' };
        }

        const updatedMembers = data.updatedMembers as IFamilyMember[];
        const currFam = useFamilyStore.getState().family;
        const newFam = {
            ...currFam,
            familyMembers: updatedMembers
        } as IFamily
        useFamilyStore.getState().setFamily(newFam);

        if (adminToRemove) {
            const userInfo = useUserStore.getState().userInfo;

            const newUserInfo = {
                ...userInfo,
                userFamilyID: '',
            } as IUser;

            useUserStore.getState().setUserInfo(newUserInfo);
        }
        

        toast.success('Members removed successfully');

        return { status: true, message: 'Members removed successfully' };

    } catch (error) {
        toast.error('Error removing members');
        return { status: false, message: 'Error removing members' };
    }
}
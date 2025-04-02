'use client'

import ActionButton from "@/components/buttons/basicActionButton"
import DeleteButton from "@/components/buttons/deleteButton"
import { useAlertStore } from "@/context/alertStore"
import { IFamily } from "@/models/types/family"
import AttemptDeleteFamily from "@/utils/apihelpers/delete/deleteFamily"
import { DeleteResponse } from "@/utils/apihelpers/delete/deleteUser"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function FamilySettings({ userFamAdminPrivs, family }: { userFamAdminPrivs: boolean, family: IFamily }) {

    const { data: session, update } = useSession();

    const handleConfirmFam = async () => {

        if (!session || !userFamAdminPrivs) {
            toast.error('You are not authorized to make this change');
            return;
        }

        const confirm = window.confirm('Are you sure you want to delete your family account? This will remove everything created by your family including recipes, and the family from the family members');
        if (!confirm) {
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };
        const attemptDelete = await AttemptDeleteFamily({ toDelete: family }, headers) as DeleteResponse;

        if (!attemptDelete || attemptDelete.status === false) {
            toast.error('Error deleting family')
            return;
        }

        await update();
        useAlertStore.getState().setGlobalToast('Family deleted successfully');

    }

    return (
        <div className="flex flex-col justify-start items-center w-full h-content divide-y divide-gray-400 space-y-2">
            <div className={`bg-mainBack p-1 w-full min-h-[608.5px] flex flex-col justify-evenly items-center py-2 sm:px-5`}>
                <div className="flex flex-col justify-start items-center w-[100%] h-[591px] bg-mainContent border border-accent/30 rounded-md space-y-12 pt-12">
                    <h1 className="text-xl md:text-2xl underline">Family Settings</h1>
                    <ActionButton buttonTitle="Change Family name" action={(() => toast.info('You would change family name here'))} />
                    <ActionButton buttonTitle="Add/Remove Admins" action={() => toast.info('You would add or remove admins here')} />
                    <DeleteButton buttonTitle="Delete Family Account" action={handleConfirmFam} />
                </div>
            </div>
        </div>
    )
}
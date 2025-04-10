'use client'

import { useAlertStore } from "@/context/alertStore";
import { IFamily } from "@/models/types/family";
import AttemptDeleteFamily from "@/utils/apihelpers/delete/deleteFamily";
import AttemptDeleteUser, { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner"

export const AccountButton = ({ family, which, userFamAdminPrivs, numAdmins }: { family: IFamily, which: string, userFamAdminPrivs: boolean, numAdmins: number }) => {

    const { data: session, update } = useSession();

    const handleConfirmAccount = async () => {

        if (!session || !userFamAdminPrivs) {
            toast.error('You are not authorized to make this change');
            return;
        }

        if (userFamAdminPrivs && numAdmins < 2) {
            toast.info('Either give admin privileges to another family member or delete the family altogether before deleting your account.')
            return;
        }

        const confirm = window.confirm('Are you sure you want to delete your account? This will remove everything created by you including recipes, posts, comments, etc.');
        if (!confirm) {
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };
        const attemptDelete = await AttemptDeleteUser(headers) as HelperResponse;

        if (!attemptDelete || attemptDelete.status === false) {
            toast.error('Error deleting user')
            return;
        }

        await signOut();
        await update();
        useAlertStore.getState().setGlobalToast('User deleted successfully');
        
    }

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
        const attemptDelete = await AttemptDeleteFamily({ toDelete: family }, headers) as HelperResponse;

        if (!attemptDelete || attemptDelete.status === false) {
            toast.error('Error deleting family')
            return;
        }

        await update();
        useAlertStore.getState().setGlobalToast('Family deleted successfully');

    }

    if (which === 'Delete Account') {
        return (
            <button onClick={handleConfirmAccount} className="text-red-700 hover:text-red-400 hover:underline" aria-label="Delete Account Confirm">
                {which}
            </button>
        )
    } else if (which === 'Delete Family') {
        return (
            <button onClick={handleConfirmFam} className="text-red-700 hover:text-red-400 hover:underline" aria-label="Delete Family return">
                {which}
            </button>
        )
    } else {
        return (
            <button onClick={() => toast.info(which)} aria-label="Delete else">
                {which}
            </button>
        )
    }
}
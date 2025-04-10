'use client'

import ActionButton from "@/components/buttons/basicActionButton"
import DeleteButton from "@/components/buttons/deleteButton"
import ChangeForm, { ChangeFormType } from "@/components/forms/changeNameForm"
import { useAlertStore } from "@/context/alertStore"
import { IFamily } from "@/models/types/family"
import { IUser } from "@/models/types/user"
import AttemptDeleteFamily from "@/utils/apihelpers/delete/deleteFamily"
import { HelperResponse } from "@/utils/apihelpers/delete/deleteUser"
import { EditFamDetails } from "@/utils/apihelpers/edit/editFamDetails"
import { useForm, UseFormReturnType } from "@mantine/form"
import { modals } from "@mantine/modals"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function FamilySettings({ userFamAdminPrivs, family }: { userFamAdminPrivs: boolean, family: IFamily }) {

    const { data: session, update } = useSession();

    const changeFamNameForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validate: {
            name: (value) => (
                !value ? 'Name is required' : null
            ),
            email: (value) => (
                !value ? 'Email is required'
                    : !/^\S+@\S+$/.test(value) ? 'Invalid email'
                        : value.length < 5 ? 'Invalid email'
                            : null
            ),
            password: (value) => (
                !value ? 'Password is required'
                    : value.length < 5 ? 'Password length must be greater than 5 characters' : null
            )
        }
    });

    const changeFamName = () => modals.openConfirmModal({
        title: 'Enter the change in the family name, then your password to confirm',
        children: (
            <ChangeForm changeFormToUse={changeFamNameForm} which={'name'} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => submitChange({ changeFamNameForm })
    });

    const submitChange = async ({ changeFamNameForm }: { changeFamNameForm: UseFormReturnType<ChangeFormType, (values: ChangeFormType) => ChangeFormType> }) => {

        if (!session) {
            toast.warning('You must be signed in to make this change');
            return;
        }
        const user = session.user as IUser
        if (!user) {
            toast.warning('You do not have permission to edit this')
        }
        if (!userFamAdminPrivs) {
            toast.error('You do not have family permissions to edit this');
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };

        const formVals = changeFamNameForm.getValues();
        if (!formVals) {
            return;
        }
        

        // if (formVals.password !== user.password) {
        //     toast.error('Password is incorrect');
        //     return;
        // }

        const changed = await EditFamDetails({ newName: formVals.name, famId: family._id }, headers) as HelperResponse;
        if (!changed.status) {
            toast.error('Issue with changing family name');
            return;
        }
        toast.info('Family Name changed');
        return;
        
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

    return (
        <div className="flex flex-col justify-start items-center w-full h-content divide-y divide-gray-400 space-y-2">
            <div className={`bg-mainBack p-1 w-full min-h-[608.5px] flex flex-col justify-evenly items-center py-2 sm:px-5`}>
                <div className="flex flex-col justify-start items-center w-[100%] h-[591px] bg-mainContent border border-accent/30 rounded-md space-y-12 pt-12">
                    <h1 className="text-xl md:text-2xl underline">Family Settings</h1>
                    <ActionButton buttonTitle="Change Family name" action={changeFamName} />
                    <ActionButton buttonTitle="Add/Remove Admins" action={() => toast.info('You would add or remove admins here')} />
                    <DeleteButton buttonTitle="Delete Family Account" action={handleConfirmFam} />
                </div>
            </div>
        </div>
    )
}
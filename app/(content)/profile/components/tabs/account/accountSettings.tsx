'use client'

import DeleteButton from "@/components/buttons/deleteButton"
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { toast } from "sonner";
import ActionButton from "@/components/buttons/basicActionButton";
import ChangeForm, { ChangeFormType } from "@/components/forms/changeNameForm";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useAlertStore } from "@/context/alertStore";
import AttemptDeleteUser, { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/models/types/user";
import { EditDetails } from "@/utils/apihelpers/edit/editDetails";

export default function AccountTab({ numAdmins, userFamAdminPrivs }: { numAdmins: number, userFamAdminPrivs: boolean }) {

    const { data: session, update } = useSession();

    const changeNameForm = useForm({
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

    const submitChange = async ({ changeNameForm, which }: { changeNameForm: UseFormReturnType<ChangeFormType, (values: ChangeFormType) => ChangeFormType>, which: string }) => {

        if (!session) {
            toast.warning('You must be signed in to make this change');
            return;
        }
        const user = session.user as IUser
        if (!user) {
            toast.warning('You do not have permission to edit this')
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };

        const formVals = changeNameForm.getValues();
        if (!formVals) {
            return;
        }

        // if (formVals.password !== user.password) {
        //     toast.error('Password is incorrect');
        //     return;
        // }

        if (which === 'name') {
            const changed = await EditDetails({ which: 'name', toEdit: formVals.name }, headers) as HelperResponse;
            if (!changed.status) {
                toast.error('Issue with changing name');
                return;
            }
            toast.info('Name changed');
            return;
        } else {
            const changed = await EditDetails({ which: 'email', toEdit: formVals.name }, headers) as HelperResponse;
            if (!changed.status) {
                toast.error('Issue with changing email');
                return;
            }
            toast.info('Email changed');
            return;
        }
    }

    const attemptDelete = async () => {

        if (!session) {
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

    };

    const confirm = () => {
        handleDeleteAttempt();
    }

    const handleDeleteAttempt = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                Are you sure you want to delete your account?
            </Text>
        ),
        confirmProps: { children: 'Confirm' },
        cancelProps: { children: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => attemptDelete(),
    });

    const changeName = () => modals.openConfirmModal({
        title: 'Enter the change in name, then your password to confirm',
        children: (
            <ChangeForm changeFormToUse={changeNameForm} which={'name'} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => submitChange({ changeNameForm, which: 'name' })
    });

    const changeEmail = () => modals.openConfirmModal({
        title: 'Enter the change in email, then your password to confirm',
        children: (
            <ChangeForm changeFormToUse={changeNameForm} which={'email'} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => submitChange({ changeNameForm, which: 'email' })
    });

    return (

        <div className="flex flex-col justify-start items-center w-full h-content divide-y divide-gray-400 space-y-2">
            <div className={`bg-mainBack p-1 w-full min-h-[608.5px] flex flex-col justify-evenly items-center py-2 sm:px-5`}>
                <div className="flex flex-col justify-start items-center w-[100%] h-[591px] bg-mainContent border border-accent/30 rounded-md space-y-12 pt-12">
                    <h1 className="text-xl md:text-2xl underline">Account Settings</h1>
                    <ActionButton buttonTitle="Change name" action={changeName} />
                    <ActionButton buttonTitle="Change email" action={changeEmail} />
                    <DeleteButton buttonTitle="Delete Account" action={confirm} />
                </div>
            </div>
        </div>

    )
}
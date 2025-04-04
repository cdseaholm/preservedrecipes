'use client'

import DeleteButton from "@/components/buttons/deleteButton"
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { toast } from "sonner";
import ActionButton from "@/components/buttons/basicActionButton";
import ChangeNameForm from "@/components/forms/changeNameForm";
import { useForm, UseFormReturnType } from "@mantine/form";
import { RegisterFormType } from "@/components/forms/registerForm";

export default function AccountTab() {

    const changeNameForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
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
            ),
            confirmPassword: (value, values) => (
                !value ? 'Must confirm your password'
                    : value.length < 5 ? 'Password length must be greater than 5 characters'
                        : value !== values.password ? 'Confirm Password and Password must match'
                            : null
            )
        }
    });

    const submitNameChange = ({ changeNameForm }: { changeNameForm: UseFormReturnType<RegisterFormType, (values: RegisterFormType) => RegisterFormType> }) => {

        const name = changeNameForm.getValues();
        if (!name) {
            return;
        }
        toast.info(name.name)
    }

    const attemptDelete = async () => {
        toast.info('Deleting')
        //handleDeleteAttempt(); //need to fix
    };

    const confirm = () => {
        handleDeleteAttempt();
    }

    const handleDeleteAttempt = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                This action is so important that you are required to confirm it with a modal. Please click
                one of these buttons to proceed.
            </Text>
        ),
        confirmProps: { children: 'Confirm' },
        cancelProps: { children: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => attemptDelete(),
    });

    const changeName = () => modals.openConfirmModal({
        title: 'Enter the change in name',
        children: (
            <ChangeNameForm changeNameForm={changeNameForm} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => submitNameChange({ changeNameForm })
    });

    const changeEmail = () => modals.openConfirmModal({
        title: 'Enter the change in name',
        children: (
            <ChangeNameForm changeNameForm={changeNameForm} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => submitNameChange({ changeNameForm })
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
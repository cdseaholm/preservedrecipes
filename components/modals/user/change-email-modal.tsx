'use client'

import { useModalStore } from "@/context/modalStore"
import { IUser } from "@/models/types/personal/user";
import { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { EditDetails } from "@/utils/apihelpers/edit/editDetails";
import { Fieldset, Modal, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangeEmailModal({ user }: { user: IUser }) {

    const [loading, setLoading] = useState(false);
    const { data: session, update } = useSession();
    const router = useRouter();
    const openEmailChangedModal = useModalStore((state) => state.openEmailChangedModal);
    const setOpenEmailChangedModal = useModalStore((state) => state.setOpenEmailChangedModal);

    const changeEmailForm = useForm({
        mode: 'controlled',
        initialValues: {
            currEmail: user.email,
            email: '',
            confirmEmail: '',
            emailPassword: '',
        },
        validate: {
            email: (value, values) => (
                value.length > 0 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? 'Invalid email address'
                    : value.length < 3 ? 'Enter a valid email'
                        : value.length > 0 && values.confirmEmail.length > 0 && value !== values.confirmEmail ? 'Emails do not match'
                            : null
            ),
            confirmEmail: (value, values) => (
                values.email.length > 0 && value !== values.email ? 'Emails do not match' :
                    value.length === 0 && values.email.length > 0 ? 'Please confirm your new email'
                        : null
            ),
            emailPassword: (value) => (value.length === 0 ? 'Current password is required to make changes' : null),
        }
    });

    const submitChange = async () => {
        setLoading(true);
        if (!session) {
            toast.warning('You must be signed in to make this change');
            setLoading(false);
            return;
        }
        const user = session.user as IUser
        if (!user) {
            toast.warning('You do not have permission to edit this');
            setLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };

        if (changeEmailForm.values.email !== changeEmailForm.values.currEmail) {
            const formVals = changeEmailForm.getValues();
            if (!formVals) {
                setLoading(false);
                return;
            }

            if (!formVals.emailPassword) {
                toast.error('You must enter your password to make changes');
                setLoading(false);
                return;
            }

            if (!formVals.currEmail) {
                toast.error('Must be signed in to make changes');
                setLoading(false);
                redirect('/');
            }

            const isValid = changeEmailForm.validate();

            if (isValid.hasErrors) {
                toast.error('Please fix the errors in the form before submitting');
                setLoading(false);
                return;
            }
            console.log('Attempting email change', formVals.email, formVals.currEmail);
            if (formVals.email !== formVals.confirmEmail) {
                toast.error('New emails do not match');
                setLoading(false);
                return;
            }
            const confirmed = confirm('Changing your email will require you to sign in again. Do you wish to proceed?');
            if (!confirmed) {
                setLoading(false);
                return;
            }
            const changed = await EditDetails({ which: 'email', toEdit: formVals.email, passwordEntered: formVals.emailPassword }, headers) as HelperResponse;
            if (!changed || changed.status === false) {
                toast.error('Issue with changing email');
                setLoading(false);
                return;
            }
            toast.info('Email changed');
            await update({
                ...session,
                user: {
                    ...session.user,
                    email: formVals.email
                }
            });
            changeEmailForm.setValues({ currEmail: formVals.email, email: '', confirmEmail: '', emailPassword: '' });
            // For email changes, it's safer to sign out and have user sign in again
            await signOut({ redirect: false });
            setLoading(false);
            changeEmailForm.setValues({ currEmail: user.email, email: '', confirmEmail: '', emailPassword: '' });
            setOpenEmailChangedModal(false);
            router.push('/');
            return;

        } else {

            setLoading(false);
            toast.info('No changes detected');

        }
    };

    const handleCancel = () => {

        setOpenEmailChangedModal(false);
        toast.info("Cancelled Changing Email");
        changeEmailForm.setValues({ currEmail: user.email, email: '', confirmEmail: '', emailPassword: '' });

    }

    return (
        <Modal opened={openEmailChangedModal} onClose={handleCancel} title="Enter your new email, then confirm with your password" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} closeOnClickOutside={true} closeOnEscape={true}>
            <form id={'modalChangeEmailForm'} className="w-full" onSubmit={changeEmailForm.onSubmit(() => submitChange())}>
                <Fieldset legend={'Email Change Form'}>
                    <TextInput
                        id={`modalChangeEmail`}
                        name={`modalChangeEmail`}
                        label={'New Email'}
                        placeholder={'johnny@appleseed.com'}
                        mt={'md'}
                        withAsterisk
                        autoComplete="off"
                        key={changeEmailForm.key('email')}
                        {...changeEmailForm.getInputProps('email')}
                    />
                    <TextInput
                        id={`modalChangeEmailCheck`}
                        name={`modalChangeEmailCheck`}
                        label={'Confirm Email'}
                        placeholder={'johnny@appleseed.com'}
                        mt={'md'}
                        withAsterisk
                        autoComplete="off"
                        key={changeEmailForm.key('confirmEmail')}
                        {...changeEmailForm.getInputProps('confirmEmail')}
                    />
                    <PasswordInput
                        id={'modalChangePasswordForEmail'}
                        name={'modalChangePasswordForEmail'}
                        label={'Password'}
                        placeholder={'123Password'}
                        mt={'md'}
                        withAsterisk
                        key={changeEmailForm.key('emailPassword')}
                        {...changeEmailForm.getInputProps('emailPassword')}
                    />
                </Fieldset>
                <div className="flex flex-row justify-evenly items-center mt-4">
                    <button
                        type="submit"
                        className={`${changeEmailForm.isDirty() ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer' : 'bg-gray-500 text-gray-400 font-semibold py-2 px-4 rounded cursor-not-allowed'}`}
                        disabled={!changeEmailForm.isDirty()}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" onClick={handleCancel} className={`bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded cursor-pointer`}>
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>

    )
}
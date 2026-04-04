'use client'

import { useModalStore } from "@/context/modalStore";
import { IUser } from "@/models/types/personal/user";
import { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { EditDetails } from "@/utils/apihelpers/edit/editDetails";
import { SaltAndHashPassword } from "@/utils/userHelpers/saltAndHash";
import { Fieldset, Modal, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordModal({ user }: { user: IUser }) {

    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const openPasswordChangedModal = useModalStore((state) => state.openPasswordChangedModal);
    const setOpenPasswordChangedModal = useModalStore((state) => state.setOpenPasswordChangedModal);

    const changePasswordForm = useForm({
        mode: 'uncontrolled',
        clearInputErrorOnChange: true,
        initialValues: {
            password: '',
            newPassword: '',
            confirmPassword: ''
        },
        validate: {
            newPassword: (value) => (
                value.length < 8 ? 'Password must be at least 8 characters long' :
                    value.length > 0 && !/[A-Z]/.test(value) ? 'Password must contain at least one uppercase letter' :
                        value.length > 0 && !/[a-z]/.test(value) ? 'Password must contain at least one lowercase letter' :
                            value.length > 0 && !/[0-9]/.test(value) ? 'Password must contain at least one number' :
                                value.length > 0 && !/[^A-Za-z0-9]/.test(value) ? 'Password must contain at least one special character' :
                                    null
            ),
            confirmPassword: (value, values) => (
                values.newPassword.length > 0 && value !== values.newPassword ? 'Passwords do not match' :
                    value.length === 0 && values.newPassword.length > 0 ? 'Please confirm your new password'
                        : null
            ),
            password: (value) => (value.length === 0 ? 'Current password is required to make changes' : null),
        }
    });

    const submitChange = async () => {
        setLoading(true);
        if (!session) {
            toast.warning('You must be signed in to make this change');
            setLoading(false);
            return;
        }

        if (!user) {
            toast.warning('You do not have permission to edit this');
            setLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };

        if (changePasswordForm.values.newPassword.length > 0) {
            const formVals = changePasswordForm.getValues();
            if (!formVals) {
                setLoading(false);
                return;
            }

            if (!formVals.password) {
                toast.error('You must enter your password to make changes');
                setLoading(false);
                return;
            }

            const isValid = changePasswordForm.validate();

            if (isValid.hasErrors) {
                toast.error('Please fix the errors in the form before submitting');
                setLoading(false);
                return;
            }

            console.log('Attempting password change');

            if (formVals.newPassword !== formVals.confirmPassword) {
                toast.error('New passwords do not match');
                setLoading(false);
                return;
            }
            const hashedNewPassword = await SaltAndHashPassword(formVals.newPassword);
            if (!hashedNewPassword) {
                toast.error('Issue with changing password');
                setLoading(false);
                return;
            }
            const changed = await EditDetails({ which: 'password', toEdit: hashedNewPassword, passwordEntered: formVals.password }, headers) as HelperResponse;
            if (!changed || changed.status === false) {
                toast.error('Issue with changing password');
                setLoading(false);
                return;
            }
            toast.info('Password changed');
            changePasswordForm.setValues({ newPassword: '', password: '', confirmPassword: '' });
            setOpenPasswordChangedModal(false);
            setLoading(false);
            router.refresh();
            return;

        } else {

            setLoading(false);
            toast.info('No changes detected');

        }
    };

    const handleCancel = () => {

        setOpenPasswordChangedModal(false);
        toast.info("Cancelled Changing Password");
        changePasswordForm.setValues({ newPassword: '', password: '', confirmPassword: '' });

    }

    return (
        <Modal opened={openPasswordChangedModal} onClose={handleCancel} title="Enter your new password twice, then confirm with your current password" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>
            <form id={'modalChangePasswordForm'} className="w-full" onSubmit={changePasswordForm.onSubmit(() => submitChange())}>
                <Fieldset legend={'Change Password Form'}>
                    <PasswordInput
                        id={'modalChangePassword'}
                        name={'modalChangePassword'}
                        label={'New Password'}
                        placeholder={'123NewPassword'}
                        mt={'md'}
                        withAsterisk
                        key={changePasswordForm.key('newPassword')}
                        {...changePasswordForm.getInputProps('newPassword')}
                    />
                    <PasswordInput
                        id={'modalChangePasswordCheck'}
                        name={'modalChangePasswordCheck'}
                        label={'Confirm New Password'}
                        placeholder={'123NewPassword'}
                        mt={'md'}
                        withAsterisk
                        key={changePasswordForm.key('confirmPassword')}
                        {...changePasswordForm.getInputProps('confirmPassword')}
                    />
                    <PasswordInput
                        id={'modalChangePasswordCurrent'}
                        name={'modalChangePasswordCurrent'}
                        label={'Current Password'}
                        placeholder={'123Password'}
                        mt={'md'}
                        withAsterisk
                        key={changePasswordForm.key('password')}
                        {...changePasswordForm.getInputProps('password')}
                    />
                </Fieldset>
                <div className="flex flex-row justify-evenly items-center mt-4">
                    <button type="submit" className={`${changePasswordForm.isDirty() ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer' : 'bg-gray-500 text-gray-400 font-semibold py-2 px-4 rounded cursor-not-allowed'}`} disabled={!changePasswordForm.isDirty()}>
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
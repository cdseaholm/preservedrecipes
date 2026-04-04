'use client'

import { useModalStore } from "@/context/modalStore";
import { IUser } from "@/models/types/personal/user";
import { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { EditDetails } from "@/utils/apihelpers/edit/editDetails";
import { Fieldset, Modal, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangeNameModal({user}: {user: IUser}) {

    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const openNameChangedModal = useModalStore((state) => state.openNameChangedModal);
    const setOpenNameChangedModal = useModalStore((state) => state.setOpenNameChangedModal);

    const changeNameForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            currName: user.name,
            name: user.name,
            namePassword: ''
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must be at least 2 characters long' : null),
            namePassword: (value) => (value.length === 0 ? 'Current password is required to make changes' : null),
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

        if (changeNameForm.values.name !== user.name) {
            const formVals = changeNameForm.getValues();
            if (!formVals) {
                setLoading(false);
                return;
            }

            if (!formVals.namePassword) {
                toast.error('You must enter your password to make changes');
                setLoading(false);
                return;
            }

            if (!formVals.currName) {
                toast.error('Must be signed in to make changes');
                setLoading(false);
                redirect('/');
            }

            const isValid = changeNameForm.validate();

            if (isValid.hasErrors) {
                toast.error('Please fix the errors in the form before submitting');
                setLoading(false);
                return;
            }
            console.log('Changing name to ', formVals.name, ' from ', formVals.currName);
            const changed = await EditDetails({ which: 'name', toEdit: formVals.name, passwordEntered: formVals.namePassword }, headers) as HelperResponse;
            if (!changed || changed.status === false) {
                toast.error('Issue with changing name');
                setLoading(false);
                return;
            }
            toast.info('Name changed');
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: formVals.name
                }
            });
            changeNameForm.setValues({ currName: formVals.name, name: formVals.name, namePassword: '' });
            setOpenNameChangedModal(false);
            setLoading(false);
            router.refresh();
            return;

        } else {

            setLoading(false);
            toast.info('No changes detected');

        }
    };

    const handleCancel = () => {

        setOpenNameChangedModal(false);
        toast.info("Cancelled Changing Name");
        changeNameForm.setValues({ currName: user.name, name: user.name, namePassword: '' });

    }

    return (
        <Modal opened={openNameChangedModal} onClose={handleCancel} title="Enter your new name, then confirm with your password" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} closeOnClickOutside={true} closeOnEscape={true}>
            <form id={'modalChangeNameForm'} className="w-full" onSubmit={changeNameForm.onSubmit(() => submitChange())}>
                <Fieldset legend={'Change Name Form'}>
                    <TextInput
                        id={'modalChangeUserInfoNameinput'}
                        name={'modalChangeUserInfoNameinput'}
                        label={'Name'}
                        placeholder={'Johnny Appleseed'}
                        mt={'md'}
                        withAsterisk
                        key={changeNameForm.key('name')}
                        {...changeNameForm.getInputProps('name')}
                    />
                    <PasswordInput
                        id={'modalChangePasswordForName'}
                        name={'modalChangePasswordForName'}
                        label={'Password'}
                        placeholder={'123Password'}
                        mt={'md'}
                        withAsterisk
                        key={changeNameForm.key('namePassword')}
                        {...changeNameForm.getInputProps('namePassword')}
                    />
                </Fieldset>
                <div className="flex flex-row justify-evenly items-center mt-4">
                    <button type="submit" className={`${changeNameForm.isDirty() ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer' : 'bg-gray-500 text-gray-400 font-semibold py-2 px-4 rounded cursor-not-allowed'}`} disabled={!changeNameForm.isDirty()}>
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
'use client'

import { useModalStore } from "@/context/modalStore";
import { Fieldset, Modal, PasswordInput, TextInput } from "@mantine/core";
import ModalTemplate from "./templates/modalTemplate";
import { toast } from "sonner";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { useForm } from '@mantine/form';
import { Session } from "next-auth";

export default function SignInModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openSignInModal = useModalStore(state => state.openSignInModal);
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: (value) => (
                !/^\S+@\S+$/.test(value) ? 'Invalid email'
                    : value.length < 5 ? 'Invalid email'
                        : null
            ),
            password: (value: string) => (
                value.length < 5 ? 'Password length must be greater than 5 characters' : null
            )
        }
    });

    const handleSignIn = async ({ email, password }: { email: string, password: string }) => {

        try {

            form.clearErrors();

            if (session) {
                toast.warning("You are already signed in!")
                return;
            }

            const validation = form.validate();

            if (!validation) {
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            let attemptStatus = signInAttempt ? signInAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error Signing in')
                return;
            }

            toast.success('Successful Sign in!');
            form.reset();
            form.clearErrors();
            await handleUpdate();
            setOpenSignInModal(false)

        } catch (error) {
            console.error('Error Signing in:', error);
        }
    }

    const handleCancel = () => {
        form.reset();
        form.clearErrors();
        setOpenSignInModal(false);
        toast.info("Cancelled Signing in");
    }

    return (
        <Modal opened={openSignInModal} onClose={handleCancel} title="Sign In" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }}>
            <ModalTemplate subtitle={null}>
                <form id="modalLoginForm" onSubmit={form.onSubmit((values) => handleSignIn(values))} onAbort={handleCancel} className="w-full">
                    <Fieldset legend="Personal Information">
                        <TextInput
                            id="modalLoginEmail"
                            name="modalLoginEmail"
                            label="Email"
                            placeholder="email@email.com"
                            mt={'md'}
                            withAsterisk
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            id="modalLoginPw"
                            name="modalLoginPw"
                            label="Password"
                            placeholder="******"
                            withAsterisk
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                    </Fieldset>
                    <section className="flex flex-row w-full justify-evenly items-center pt-5">
                        <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                            Cancel
                        </button>
                        <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                            Sign In
                        </button>
                    </section>
                </form>
            </ModalTemplate>
        </Modal>
    )
}
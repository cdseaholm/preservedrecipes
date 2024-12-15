import { useModalStore } from "@/context/modalStore";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { Fieldset, TextInput, PasswordInput } from "@mantine/core";
import { Metadata } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'A page dedicated to allow users to login.',
}

export default async function Page() {

    const { data: session } = useSession();
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);
    const [emailError, setEmailError] = useState<string>('');
    const [pwError, setPwError] = useState<string>('');

    const clearErrors = async () => {
        setEmailError('');
        setPwError('')
    }

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {

            await clearErrors();

            if (session) {
                toast.warning("You are already signed in!")
                return;
            }

            const emailVal = event.currentTarget['modalLoginEmail'].value as string;
            const pwVal = event.currentTarget['modalLoginPw'].value as string;

            if (!emailVal && !pwVal) {
                setEmailError('Email Required');
                setPwError('Password required');
                return;
            } else if (!emailVal) {
                setEmailError('Email Required');
                return;
            } else if (!pwVal) {
                setPwError('Password required')
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: emailVal, pwPassed: pwVal }) as { status: boolean, error: string, whichInput: string };

            let attemptStatus = signInAttempt ? signInAttempt.status : false;
            let attemptError = signInAttempt ? signInAttempt.error : '';
            let inputError = signInAttempt ? signInAttempt.whichInput : '';

            if (attemptStatus === false) {
                if (inputError === 'email') {
                    setEmailError(attemptError);
                } else {
                    setPwError(attemptError)
                }
                return;
            }

            toast.success('Successful sign in!')
            setOpenSignInModal(false)

        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    const handleCancel = () => {
        clearErrors();
        setOpenSignInModal(false);
        toast.info("Cancelled Signing out");
    }

    return (
        <form onSubmit={handleSignIn} className="w-full">
            <Fieldset legend="Personal Information">
                <TextInput name="modalLoginEmail" label="Email" placeholder="email@email.com" mt={'md'} withAsterisk error={emailError === '' ? false : emailError} />
                <PasswordInput name="modalLoginPw" label="Password" placeholder="*****" withAsterisk error={pwError === '' ? false : pwError} />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                <button onClick={() => handleCancel()} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                    Cancel
                </button>
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                    Sign In
                </button>
            </section>
        </form>
    );
}
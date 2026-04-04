'use client'

import SignInForm, { SignInFormType } from "@/components/forms/personal/signInForm";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { useWindowSizes } from "@/context/width-height-store";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { UseFormReturnType } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function SignInPage({ handleCancel, handleLoading }: { handleCancel: () => void, handleLoading: (loading: boolean) => void }) {

    const router = useRouter();
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);
    const { data: session, update } = useSession();
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();

    const handleSignIn = async ({ signInForm }: { signInForm: UseFormReturnType<SignInFormType, (values: SignInFormType) => SignInFormType> }) => {

        handleLoading(true);

        try {

            signInForm.clearErrors();

            if (session) {

                toast.warning("You are already signed in!");
                handleLoading(false);
                return;

            }

            const values = signInForm.getValues();
            const email = values.email;
            const password = values.password;
            const validation = signInForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                handleLoading(false);
                return;
            }

            if (!validation) {
                handleLoading(false);
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            let attemptStatus = signInAttempt ? signInAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error Signing in');
                handleLoading(false);
                return;
            }

            await exit();

        } catch (error) {
            handleLoading(false);
            console.error('Error Signing in:', error);
            return;
        }
    }

    const exit = async () => {
        toast.success('Successful Sign in!');
        await update();
        resetZoom(width, false);
        handleLoading(false);
        setOpenSignInModal(false);
        router.replace('/u/profile')
    }

    return (
        <SignInForm handleCancel={handleCancel} handleSignIn={handleSignIn} />
    );
}
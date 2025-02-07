'use client'

import SignInForm, { SignInFormType } from "@/components/forms/signInForm";
import { useStateStore } from "@/context/stateStore";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { UseFormReturnType } from "@mantine/form";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

export default function SignInPage() {

    const { data: session, update } = useSession();
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);

    const handleSignIn = async ({ signInForm }: { signInForm: UseFormReturnType<SignInFormType, (values: SignInFormType) => SignInFormType> }) => {

        try {

            signInForm.clearErrors();

            if (session) {

                toast.warning("You are already signed in!")
                return;

            }

            const values = signInForm.getValues();
            const email = values.email;
            const password = values.password;
            const validation = signInForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                return;
            }

            if (!validation) {
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            let attemptStatus = signInAttempt ? signInAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error Signing in')
                return;
            }

            await exit();

        } catch (error) {
            console.error('Error Signing in:', error);
            return;
        }
    }

    const exit = async () => {
        toast.success('Successful Sign in!');
        await update();
        resetZoom(width, false);
    }

    const handleCancel = () => {
        resetZoom(width, false);
        toast.info("Cancelled Signing in");
    }

    return (
        <SignInForm handleCancel={handleCancel} handleSignIn={handleSignIn} />
    );
}
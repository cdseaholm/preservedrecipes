'use client'

import SignInForm, { SignInFormType } from "@/components/forms/personal/signInForm";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { useWindowSizes } from "@/context/width-height-store";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { UseFormReturnType } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/buttons/googleSignInButton";

export default function SignInPage({ handleCancel, handleLoading }: { handleCancel: () => void, handleLoading: (loading: boolean) => void }) {

    const router = useRouter();
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);
    const { data: session, update } = useSession();
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();
    const [submitting, setSubmitting] = useState(false);

    const handleSignIn = async ({ signInForm }: { signInForm: UseFormReturnType<SignInFormType, (values: SignInFormType) => SignInFormType> }) => {

        handleLoading(true);
        setSubmitting(true);

        try {

            signInForm.clearErrors();

            if (session) {

                toast.warning("You are already signed in!");
                handleLoading(false);
                setSubmitting(false);
                return;

            }

            const values = signInForm.getValues();
            const email = values.email.trim().toLowerCase();
            const password = values.password;
            const validation = signInForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                handleLoading(false);
                setSubmitting(false);
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            let attemptStatus = signInAttempt ? signInAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error Signing in');
                handleLoading(false);
                setSubmitting(false);
                return;
            }

            toast.success('Successful Sign in!');
            await update();
            resetZoom(width, false);
            router.replace('/u/profile');
            handleLoading(false);
            setSubmitting(false);
            setOpenSignInModal(false);

        } catch (error) {
            handleLoading(false);
            setSubmitting(false);
            console.error('Error Signing in:', error);
            toast.error('Something went wrong while signing in. Please try again.');
            return;
        }
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <GoogleSignInButton />
            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-mainText/50">
                <span className="h-px flex-1 bg-accent/20" />
                or sign in with email
                <span className="h-px flex-1 bg-accent/20" />
            </div>
            <SignInForm handleCancel={handleCancel} handleSignIn={handleSignIn} loading={submitting} />
        </div>
    );
}

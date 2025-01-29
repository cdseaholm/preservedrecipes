'use client'

import { useModalStore } from "@/context/modalStore";
import { Modal } from "@mantine/core";
import ModalTemplate from "./templates/modalTemplate";
import { toast } from "sonner";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { UseFormReturnType } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import SignInForm, { SignInFormType } from "../forms/signInForm";

export default function SignInModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openSignInModal = useModalStore(state => state.openSignInModal);
    const setOpenSignInModal = useModalStore(state => state.setOpenSignInModal);
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
        await handleUpdate();
        resetZoom(width, false);
        setOpenSignInModal(false);
    }

    const handleCancel = () => {
        resetZoom(width, false);
        setOpenSignInModal(false);
        toast.info("Cancelled Signing in");
    }

    return (
        <Modal opened={openSignInModal} onClose={handleCancel} title="Sign In" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
            <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
                <SignInForm handleCancel={handleCancel} handleSignIn={handleSignIn} />
            </ModalTemplate>
        </Modal>
    )
}
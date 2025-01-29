'use client'

import { useModalStore } from "@/context/modalStore";
import { Modal } from "@mantine/core";
import ModalTemplate from "./templates/modalTemplate";
import { toast } from "sonner";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { UseFormReturnType } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useFamilyStore } from "@/context/familyStore";
import { InviteRegCheck } from "@/utils/apihelpers/register/inviteSignInCheck";
import { useRouter } from "next/navigation";
import InviteSignInForm, { InviteSignInFormType } from "../forms/inviteSignInForm";
import { useState } from "react";
import { LoadingSpinner } from "../misc/loadingSpinner";
import { useAlertStore } from "@/context/alertStore";

export default function InviteSignInModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openInviteSignInModal = useModalStore(state => state.openInviteSignInModal);
    const setOpenInviteSignInModal = useModalStore(state => state.setOpenInviteSignInModal);
    const setGlobalToast = useAlertStore(state => state.setGlobalToast);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);
    const invite = useFamilyStore(state => state.invite);
    const router = useRouter();
    const currentUser = session ? session.user : null;
    const currentEmail = currentUser ? currentUser.email : '';
    const accepting = session !== null && invite !== null && currentEmail === invite.email ? true : false;
    const [loading, setLoading] = useState(false)

    const InviteCheckFunc = async () => {

        let inviteCheck = {} as { status: boolean, message: string };

        if (!invite) {
            return false;
        }

        inviteCheck = await InviteRegCheck({ invite: invite }) as { status: boolean, message: string };

        if (!inviteCheck) {
            toast.error('Invite check error');
            return false;
        }

        if (inviteCheck.status === false) {
            toast.error(inviteCheck.message);
            return false;
        }

        return true;

    }

    const handleSignIn = async ({ inviteSignInForm }: { inviteSignInForm: UseFormReturnType<InviteSignInFormType, (values: InviteSignInFormType) => InviteSignInFormType> }) => {

        try {

            setLoading(true);
            inviteSignInForm.clearErrors();

            if (session) {

                if (invite === null) {
                    setGlobalToast("You are already signed in!");
                    setLoading(false);
                    router.replace('/profile');
                    return;
                }

                if (invite.email !== currentEmail) {
                    setGlobalToast("Sign in as the intended user to receive this invite!");
                    setLoading(false);
                    router.replace('/profile');
                    return;
                }

                const checked = await InviteCheckFunc();
                if (!checked) {
                    setLoading(false);
                    return;
                }
                await exit(true);

            } else {


                const values = inviteSignInForm.getValues();
                const email = values.email;
                const password = values.password;
                const validation = inviteSignInForm.validate();

                if (!validation) {
                    toast.error('Issue with validation')
                    setLoading(false);
                    return;
                }

                if (Object.keys(validation.errors).length > 0) {
                    inviteSignInForm.setErrors(validation.errors)
                    setLoading(false);
                    return;
                }

                let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

                let attemptStatus = signInAttempt ? signInAttempt.status : false;

                if (attemptStatus === false) {
                    toast.error('Error Signing in');
                    setLoading(false);
                    return;
                }

                const checked = await InviteCheckFunc();

                if (!checked) {
                    setLoading(false);
                    return;
                }

                await exit(false);
            }

        } catch (error) {
            setLoading(false);
            return;
        }
    }

    const exit = async (invited: boolean) => {
        toast.success('Successful Sign in!');
        await handleUpdate();
        resetZoom(width, false);
        setLoading(false);
        setOpenInviteSignInModal(false);
        if (invited) {
            router.replace('/profile')
        }
    }

    const handleCancel = () => {
        resetZoom(width, false);
        setOpenInviteSignInModal(false);
        toast.info("Cancelled Signing in");
    }

    return (
        loading ? (
            <LoadingSpinner screen={false} />
        ) : (
            <Modal opened={openInviteSignInModal} onClose={handleCancel} title="Sign In" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
                <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
                    <InviteSignInForm handleCancel={handleCancel} handleSignIn={handleSignIn} accepting={accepting} />
                </ModalTemplate>
            </Modal>
        )
    )
}
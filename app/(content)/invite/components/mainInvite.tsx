'use client'

import RegisterHelper from "@/utils/apihelpers/register/registerHelper";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { IUser } from "@/models/types/personal/user";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { useStateStore } from "@/context/stateStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/context/modalStore";
import { InviteRegisterFormType } from "@/components/forms/family/inviteRegisterForm";
import { UseFormReturnType } from "@mantine/form";
import { OpenInvite } from "@/utils/apihelpers/register/openCheckInvite";
import { User } from "next-auth";
import InviteRegisterForm from "@/components/forms/family/inviteRegisterForm";
import { InviteRegCheck } from "@/utils/apihelpers/register/inviteSignInCheck";
import { useAlertStore } from "@/context/alertStore";
import { useUserStore } from "@/context/userStore";
import { IInvite } from "@/models/types/misc/invite";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useWindowSizes } from "@/context/width-height-store";

export default function InvitePage({ token, userInfo }: { token: string | null, userInfo: IUser | null }) {

    const router = useRouter();
    const { data: session, update } = useSession();

    const setGlobalToast = useAlertStore(state => state.setGlobalToast);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const { width } = useWindowSizes();
    const forwardRef = useRef('');

    const forward = useCallback(() => {
        if (forwardRef.current !== '') {
            const stringToUse = forwardRef.current as string;
            router.replace(stringToUse)
        }
    }, [router]);


    const [invite, setInvite] = useState<IInvite | null>(null);

    const currentUser = session ? session.user as User : {} as User;
    const currentEmail = currentUser?.email?.trim().toLowerCase() || '';

    if (token === null) {
        forwardRef.current = '/register';
        forward();
    }

    const handleRegister = async ({ inviteRegisterForm }: { inviteRegisterForm: UseFormReturnType<InviteRegisterFormType, (values: InviteRegisterFormType) => InviteRegisterFormType> }) => {

        setGlobalLoading(true);
        try {

            inviteRegisterForm.clearErrors();

            if (session) {
                toast.warning("You are already signed in!");
                setGlobalLoading(false);
                return;
            }

            const values = inviteRegisterForm.getValues();
            const name = values.name;
            const email = values.email.trim().toLowerCase();
            const password = values.password;
            const validation = inviteRegisterForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                inviteRegisterForm.setErrors(validation.errors);
                setGlobalLoading(false);
                return;
            }

            const registerHelp = await RegisterHelper({ namePassed: name, emailPassed: email, pwPassed: password, invite: invite }) as { status: boolean, newUser: IUser | null };

            if (!registerHelp) {
                toast.error('Error registering regsiter null');
                setGlobalLoading(false);
                return
            }

            const attemptStatus = registerHelp.status as boolean;

            if (!attemptStatus) {
                toast.error('Error Registering status false');
                setGlobalLoading(false);
                return;
            }

            const createdUser = registerHelp.newUser;

            if (!createdUser) {
                toast.error('Error creatin user');
                setGlobalLoading(false);
                return;
            }

            const signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            if (!signInAttempt || !signInAttempt.status) {
                toast.error('Error signing in');
                setGlobalLoading(false);
                return;
            }

            useUserStore.getState().setUserInfo(createdUser)

            if (invite) {
                const inviteCheck = await InviteRegCheck({ invite: invite }) as { status: boolean, message: string };

                if (!inviteCheck) {
                    toast.error('Invite null');
                    setGlobalLoading(false)
                    return;
                }

                if (inviteCheck.status === false) {
                    toast.error(inviteCheck.message);
                    setGlobalLoading(false)
                    return;
                }

            }

            toast.success('Registered and Signed in!');
            inviteRegisterForm.reset();
            inviteRegisterForm.clearErrors();
            await update();
            setGlobalLoading(false)
            resetZoom(width, false);
            router.push('/u/profile')

        } catch (error) {
            setGlobalLoading(false);
            return;
        }
    }

    useEffect(() => {
        async function fetchInvite(token: string) {
            const inviteExists = await OpenInvite({ token: token }) as { status: boolean, message: string, invite: IInvite, userExists: boolean };
            if (!inviteExists) {
                forwardRef.current = '/';
                forward();
                return;
            }

            if (inviteExists && inviteExists.status === false) {
                toast.error('Issue with invite, please have family admin send another')
                return;
            }

            const inviteEmail = inviteExists.invite.email.trim().toLowerCase();

            if (inviteExists && session && currentEmail !== inviteEmail) {
                forwardRef.current = '/u/profile';
                forward();
                setGlobalToast(`Make sure you're signed into the proper account to accept this invite`);
                return;
            }

            setInvite(inviteExists.invite);

            if (inviteExists && inviteExists.userExists) {
                useModalStore.getState().setOpenInviteSignInModal(true);
                return;
            }

            return;
        }

        if (token) {
            fetchInvite(token);
        }

    }, [token, currentEmail, session, setGlobalToast, forward]);

    return (
        <NavWrapper userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <h1>Register</h1>
                {invite && <p>You have been invited to join a family!</p>}
                <InviteRegisterForm handleRegister={handleRegister} />
            </ContentWrapper>
        </NavWrapper>
    )
}

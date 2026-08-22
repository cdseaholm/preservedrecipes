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
import { useAlertStore } from "@/context/alertStore";
import { useUserStore } from "@/context/userStore";
import { IInvite } from "@/models/types/misc/invite";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useWindowSizes } from "@/context/width-height-store";
import { InviteRegCheck } from "@/utils/apihelpers/register/inviteSignInCheck";

export default function InvitePage({ token, userInfo }: { token: string | null, userInfo: IUser | null }) {

    const router = useRouter();
    const { data: session, update } = useSession();

    const setGlobalToast = useAlertStore(state => state.setGlobalToast);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const { width } = useWindowSizes();
    const forwardRef = useRef('');
    const registeringRef = useRef(false);
    const registrationCompleteRef = useRef(false);

    const forward = useCallback(() => {
        if (forwardRef.current !== '') {
            const stringToUse = forwardRef.current as string;
            router.replace(stringToUse)
        }
    }, [router]);


    const [invite, setInvite] = useState<IInvite | null>(null);

    const currentUser = session ? session.user as User : {} as User;
    const currentEmail = currentUser?.email?.trim().toLowerCase() || '';

    const acceptInviteForSignedInUser = useCallback(async (inviteToAccept: IInvite) => {
        const inviteEmail = inviteToAccept.email.trim().toLowerCase();

        if (!session || currentEmail !== inviteEmail) {
            return false;
        }

        const accepted = await InviteRegCheck({ invite: inviteToAccept }) as { status: boolean, message?: string };
        if (!accepted.status) {
            toast.error(accepted.message || 'Issue accepting invite');
            return false;
        }

        await update();
        useUserStore.getState().setUserInfo({
            ...useUserStore.getState().userInfo,
            userFamilyID: inviteToAccept.familyID,
        });
        toast.success('Invite accepted!');
        resetZoom(width, false);
        router.replace('/u/profile');
        return true;
    }, [currentEmail, router, session, update, resetZoom, width]);

    if (token === null) {
        forwardRef.current = '/register';
        forward();
    }

    const handleRegister = async ({ inviteRegisterForm }: { inviteRegisterForm: UseFormReturnType<InviteRegisterFormType, (values: InviteRegisterFormType) => InviteRegisterFormType> }) => {

        setGlobalLoading(true);
        registeringRef.current = true;
        try {

            inviteRegisterForm.clearErrors();

            if (session) {
                registeringRef.current = false;
                if (invite) {
                    if (currentEmail !== invite.email.trim().toLowerCase()) {
                        toast.warning('Sign out and use the invited email to accept this invite.');
                    } else {
                        await acceptInviteForSignedInUser(invite);
                    }
                } else {
                    router.replace('/u/profile');
                }
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
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            if (!invite) {
                toast.error('Invite not found');
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            if (email !== invite.email.trim().toLowerCase()) {
                inviteRegisterForm.setFieldError('email', 'Use the email address this invite was sent to');
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            const registerHelp = await RegisterHelper({ namePassed: name, emailPassed: email, pwPassed: password, invite: invite }) as { status: boolean, newUser: IUser | null, message?: string };

            if (!registerHelp) {
                toast.error('Error registering regsiter null');
                registeringRef.current = false;
                setGlobalLoading(false);
                return
            }

            const attemptStatus = registerHelp.status as boolean;

            if (!attemptStatus) {
                const message = registerHelp.message === 'User already exists'
                    ? 'Email is already in use. Sign in to accept this invite.'
                    : registerHelp.message || 'Error registering';
                toast.error(message);
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            const createdUser = registerHelp.newUser;

            if (!createdUser) {
                toast.error('Error creatin user');
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            const signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            if (!signInAttempt || !signInAttempt.status) {
                toast.error('Error signing in');
                registeringRef.current = false;
                setGlobalLoading(false);
                return;
            }

            useUserStore.getState().setUserInfo(createdUser)

            registrationCompleteRef.current = true;
            setInvite(null);
            toast.success('Registered and Signed in!');
            inviteRegisterForm.reset();
            inviteRegisterForm.clearErrors();
            await update();
            resetZoom(width, false);
            router.replace('/u/profile')
            setGlobalLoading(false)

        } catch (error) {
            registeringRef.current = false;
            setGlobalLoading(false);
            return;
        }
    }

    useEffect(() => {
        async function fetchInvite(token: string) {
            if (registeringRef.current || registrationCompleteRef.current) {
                return;
            }

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

            if (inviteExists && session && currentEmail === inviteEmail) {
                await acceptInviteForSignedInUser(inviteExists.invite);
                return;
            }

            if (inviteExists && inviteExists.userExists) {
                useModalStore.getState().setOpenInviteSignInModal(true);
                return;
            }

            return;
        }

        if (token) {
            fetchInvite(token);
        }

    }, [token, currentEmail, session, setGlobalToast, forward, acceptInviteForSignedInUser]);

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

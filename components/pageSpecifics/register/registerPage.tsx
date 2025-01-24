'use client'

import RegisterHelper from "@/utils/apihelpers/register/registerHelper";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IUser } from "@/models/types/user";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { useStateStore } from "@/context/stateStore";
import { useRouter } from "next/router";
import { IInvite } from "@/models/types/invite";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/context/modalStore";
import { OpenInvite } from "@/utils/apihelpers/register/openCheckInvite";
import RegisterForm, { RegisterFormType } from "@/components/forms/registerForm";
import { UseFormReturnType } from "@mantine/form";

export default function RegisterPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);
    const router = useRouter();
    const { token } = router.query;
    const [invite, setInvite] = useState<IInvite | null>(null);

    const handleRegister = async ({ registerForm }: { registerForm: UseFormReturnType<RegisterFormType, (values: RegisterFormType) => RegisterFormType> }) => {

        setLoading(true)
        try {

            registerForm.clearErrors();

            if (session) {
                toast.warning("You are already signed in!");
                setLoading(false);
                return;
            }

            const { name, email, password } = registerForm.values;
            const validation = registerForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                setLoading(false);
                return;
            }

            let attemptStatus = false;
            let createdUser = {} as IUser;

            let signInAttempt = await RegisterHelper({ namePassed: name, emailPassed: email, pwPassed: password, invite: invite }) as { status: boolean, newUser: IUser };
            console.log(signInAttempt);

            if (!signInAttempt) {
                toast.error('Error registering');
                setLoading(false);
                return
            }

            attemptStatus = signInAttempt.status;
            createdUser = signInAttempt.newUser;

            if (attemptStatus === false || createdUser === {} as IUser) {
                toast.error('Error Registering');
                setLoading(false);
                return;
            } else {

                let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

                if (!signInAttempt) {
                    toast.error('Error signing in');
                    setLoading(false);
                    return;
                }

                toast.success('Registered and Signed in!');
                registerForm.reset();
                registerForm.clearErrors();
                await update();
                resetZoom(width, false);
                //setOpenPref(true)
            }

        } catch (error) {
            console.error('Error Registering in:', error);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        async function fetchInvite(token: string | string[]) {
            const inviteExists = await OpenInvite({ token: token }) as { status: boolean, message: string, invite: IInvite, userExists: boolean };
            if (!inviteExists || inviteExists && inviteExists.status === false) {

                console.log('invite update: ', inviteExists.message)
                return;

            } else if (inviteExists && !inviteExists.userExists) {

                console.log('Create account to join family');
                setInvite(inviteExists.invite);
                return;

            } else {

                console.log('Sign in to join family');
                useModalStore.getState().setOpenSignInModal(true);

            }
        }

        if (token) {
            console.log(token)
            fetchInvite(token);
        }
    }, [token]);

    return (

        loading ? (
            <LoadingSpinner screen={false} />
        ) : (
            <section className="flex flex-col justify-start items-center w-full h-content gap-5 pt-6">
                <h1>Register</h1>
                {invite && <p>You have been invited to join a family!</p>}
                <RegisterForm handleRegister={handleRegister} />
            </section>
        )
    )
}
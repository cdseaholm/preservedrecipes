'use client'

import { toast } from "sonner";
import { IUser } from "@/models/types/personal/user";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { useStateStore } from "@/context/stateStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RegisterFormType } from "@/models/types/misc/register";
import RegisterForm from "@/components/forms/personal/registerForm";
import NavWrapper from "@/components/wrappers/navWrapper";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import { useWindowSizes } from "@/context/width-height-store";
import { CreateUser } from "@/utils/server-actions/user";
import GoogleSignInButton from "@/components/buttons/googleSignInButton";
import { useState } from "react";

export default function RegisterPage({ userInfo }: { userInfo: IUser | null }) {

    const { data: session, update } = useSession();
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const { width } = useWindowSizes();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);


    const handleRegister = async ({ registerForm }: { registerForm: RegisterFormType }) => {

        setGlobalLoading(true)
        setSubmitting(true);
        try {

            registerForm.clearErrors();

            if (session) {
                toast.warning("You are already signed in!");
                setGlobalLoading(false);
                setSubmitting(false);
                return;
            }

            const values = registerForm.getValues();
            const name = values.name;
            const email = values.email.trim().toLowerCase();
            const password = values.password;
            const validation = registerForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                setGlobalLoading(false);
                setSubmitting(false);
                return;
            }

            let attemptStatus = false;

            let registerAttempt = await CreateUser({ name: name, email: email, password: password, route: '/u/profile' }) as { status: boolean, message: string, newUser: IUser | null };

            if (!registerAttempt) {
                toast.error('Error registering');
                setGlobalLoading(false);
                setSubmitting(false);
                return
            }

            attemptStatus = registerAttempt.status;

            if (!attemptStatus) {
                toast.error(registerAttempt.message || 'Error registering');
                setGlobalLoading(false);
                setSubmitting(false);
                return;
            }

            if (!registerAttempt.newUser) {
                toast.error('Error registering, no user created');
                setGlobalLoading(false);
                setSubmitting(false);
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            if (!signInAttempt || !signInAttempt.status) {
                toast.error('Error signing in');
                setGlobalLoading(false);
                setSubmitting(false);
                return;
            }

            toast.success('Registered and Signed in!');
            registerForm.reset();
            registerForm.clearErrors();
            await update();
            resetZoom(width, false);
            setGlobalLoading(false);
            setSubmitting(false);
            router.push('/u/profile');

        } catch (error) {
            toast.error('Something went wrong while registering. Please try again.');
            setGlobalLoading(false);
            setSubmitting(false);
            return;
        }
    }

    return (

        <NavWrapper userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <h1 className="text-xl md:text-2xl underline">Register</h1>
                <div className="my-4 flex w-full max-w-md flex-col gap-4">
                    <GoogleSignInButton label="Sign up with Google" />
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-mainText/50">
                        <span className="h-px flex-1 bg-accent/20" />
                        or
                        <span className="h-px flex-1 bg-accent/20" />
                    </div>
                </div>
                <RegisterForm handleRegister={handleRegister} loading={submitting} />
            </ContentWrapper>
        </NavWrapper>
    )
}

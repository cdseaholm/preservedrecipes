'use client'

import { useState } from "react";
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
import { LoadingOverlay } from "@mantine/core";
import { useWindowSizes } from "@/context/width-height-store";
import { CreateUser } from "@/utils/server-actions/user";

export default function RegisterPage({ userInfo }: { userInfo: IUser | null }) {

    const { data: session, update } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();
    const router = useRouter();


    const handleRegister = async ({ registerForm }: { registerForm: RegisterFormType }) => {

        setLoading(true)
        try {

            registerForm.clearErrors();

            if (session) {
                toast.warning("You are already signed in!");
                setLoading(false);
                return;
            }

            const values = registerForm.getValues();
            const name = values.name;
            const email = values.email.trim().toLowerCase();
            const password = values.password;
            const validation = registerForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                setLoading(false);
                return;
            }

            let attemptStatus = false;

            let registerAttempt = await CreateUser({ name: name, email: email, password: password, route: '/u/profile' }) as { status: boolean, message: string, newUser: IUser | null };

            if (!registerAttempt) {
                toast.error('Error registering');
                setLoading(false);
                return
            }

            attemptStatus = registerAttempt.status;

            if (!attemptStatus) {
                toast.error(registerAttempt.message || 'Error registering');
                setLoading(false);
                return;
            }

            if (!registerAttempt.newUser) {
                toast.error('Error registering, no user created');
                setLoading(false);
                return;
            }

            let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

            if (!signInAttempt || !signInAttempt.status) {
                toast.error('Error signing in');
                setLoading(false);
                return;
            }

            toast.success('Registered and Signed in!');
            registerForm.reset();
            registerForm.clearErrors();
            await update();
            resetZoom(width, false);
            router.push('/u/profile');

        } catch (error) {
            setLoading(false);
            return;
        }
    }

    return (

        <NavWrapper loadingChild={<LoadingOverlay visible={loading} />} userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <h1 className="text-xl md:text-2xl underline">Register</h1>
                <RegisterForm handleRegister={handleRegister} />
            </ContentWrapper>
        </NavWrapper>
    )
}

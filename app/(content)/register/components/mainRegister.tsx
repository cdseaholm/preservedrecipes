'use client'

import RegisterHelper from "@/utils/apihelpers/register/registerHelper";
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
            const email = values.email;
            const password = values.password;
            const validation = registerForm.validate();

            if (Object.keys(validation.errors).length > 0) {
                setLoading(false);
                return;
            }

            let attemptStatus = false;
            let createdUser = {} as IUser;

            let signInAttempt = await RegisterHelper({ namePassed: name, emailPassed: email, pwPassed: password, invite: null }) as { status: boolean, newUser: IUser };

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
                router.push('/profile')
            }

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
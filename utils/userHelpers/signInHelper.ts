import { signIn } from "next-auth/react";

export default async function SignInHelper({ emailPassed, pwPassed }: { emailPassed: string, pwPassed: string }) {

    if (!emailPassed || !pwPassed) {
        return { status: false }
    }

    const res = await signIn('credentials', {
        email: emailPassed,
        password: pwPassed,
        redirect: false,
    });

    if (res && res.error) {
        console.log('Error logging in:', res.error);
        return { status: false };
    }

    return { status: true }
}
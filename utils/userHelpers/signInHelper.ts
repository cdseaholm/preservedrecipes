import { signIn } from "next-auth/react";

export default async function SignInHelper({ emailPassed, pwPassed }: { emailPassed: string, pwPassed: string }) {

    const normalizedEmail = emailPassed?.trim().toLowerCase();

    if (!normalizedEmail || !pwPassed) {
        return { status: false }
    }

    const res = await signIn('credentials', {
        email: normalizedEmail,
        password: pwPassed,
        redirect: false,
    });

    if (!res || !res.ok || res.error) {
        return { status: false };
    }

    return { status: true }
}

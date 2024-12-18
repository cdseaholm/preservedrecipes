import SignInPage from "@/components/pageSpecifics/SignIn/signIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'A page dedicated to allow users to login.',
}

export default async function Page() {

    return (
        <SignInPage />
    );
}
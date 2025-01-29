
import SignInPage from "@/components/pageSpecifics/signIn/signInPage";
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
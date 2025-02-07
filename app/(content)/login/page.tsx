
import { Metadata } from "next";
import SignInPage from "./components/mainLogin";

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'A page dedicated to allow users to login.',
}

export default function Page() {

    return (
        <SignInPage />
    );
}
import RegisterPage from "@/components/pageSpecifics/register/registerPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'A page dedicated to allow users to register.',
}

export default async function Page() {

    return (
        <RegisterPage />
    );
}
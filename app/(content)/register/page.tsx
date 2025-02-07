import { Metadata } from "next";
import RegisterPage from "./components/mainRegister";

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'A page dedicated to allow users to register.',
}

export default function Page() {

    return (
        <RegisterPage />
    );
}
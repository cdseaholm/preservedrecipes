import { Metadata } from "next";
import RegisterPage from "./components/mainRegister";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'A page dedicated to allow users to register.',
}

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        if (userDoc) {
            redirect("/u/profile");
        }

    }

    return (
        <RegisterPage userInfo={null} />
    );
}

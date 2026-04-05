import { Metadata } from "next";
import RegisterPage from "./components/mainRegister";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'A page dedicated to allow users to register.',
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);

    }

    return (
        <RegisterPage userInfo={userInfo} />
    );
}
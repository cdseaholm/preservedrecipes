
import { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInLanding from "@/app/(content)/login/components/sign-in-landing";

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'A page dedicated to allow users to login.',
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);
        if (userInfo && userInfo.email === session.user.email) {
            redirect('/u/profile');
        }

    }

    return (

        <SignInLanding />

    );
}
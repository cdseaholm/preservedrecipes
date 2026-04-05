import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import NavWrapper from "@/components/wrappers/navWrapper";
import { redirect } from "next/navigation";
import SettingsPage from "../components/settings-page";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: userName ? `${userName}'s Settings - Preserved Recipes` : 'Settings - Preserved Recipes',
        description: userName ? `Settings page for ${userName} on Preserved Recipes` : 'Settings page on Preserved Recipes',
    };
}

export default async function Page() {


    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/');
    }

    try {

        await connectDB();

        // Query database directly - no API route needed!
        const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

        if (!userDoc) {
            console.log('No user found', session.user.email, userDoc);
            redirect('/');
        }

        const user = serializeDoc<IUser>(userDoc);

        return (
            <NavWrapper userInfo={user} loadingChild={null}>
                <SettingsPage user={user} />
            </NavWrapper>
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect('/');
    }
}
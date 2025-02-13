import { Metadata } from "next";
import { getServerSession } from "next-auth";
import ProfilePage from "./components/mainProfile";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: userName ? `${userName}'s Profile - Preserved Recipes` : 'Profile - Preserved Recipes',
        description: userName ? `Profile page for ${userName} on Preserved Recipes` : 'Profile page on Preserved Recipes',
    };
}

export default async function Page() {

    return (
        <ProfilePage />
    );
}
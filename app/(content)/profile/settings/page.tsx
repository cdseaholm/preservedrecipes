import ProfileSettings from "@/components/pageSpecifics/profile/settingsPage";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : '';
    const userName = user ? user.name : ''

    return {
        title: `Profile Settings for ${userName}`,
        description: `Profile Settings for ${userName} to manage their personal information profile`,
    };
}

export default async function Page() {
    const session = await getServerSession();

    return (
        <ProfileSettings session={session} />
    );
}
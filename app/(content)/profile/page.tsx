import ProfilePage from "@/components/pageSpecifics/profile/profilePage";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: `Profile Page for ${userName}`,
        description: `A Profile Page for ${userName} to manage their personal information, and connected recipes`,
    };
}

export default async function Page() {

    const admin = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME as string : 'null';

    return (
        <ProfilePage admin={admin}/>
    );
}
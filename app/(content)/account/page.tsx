
import AccountPage from "@/components/pageSpecifics/account/accountPage";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : '';
    const userName = user ? user.name : ''

    return {
        title: `Profile Page for ${userName}`,
        description: `A Profile Page for ${userName} to manage their personal information, and connected recipes`,
    };
}

export default async function Page() {
    const session = await getServerSession();

    return (
        <AccountPage session={session} />
    );
}

import FamilySettings from "@/components/pageSpecifics/family/familySettings";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : '';
    const userName = user ? user.name : '';
    //init family and get family name

    return {
        title: `Family Settings for *FamilyName*`,
        description: `A Profile Page for ${userName} to manage their personal information, and connected recipes`,
    };
}

export default async function Page() {
    const session = await getServerSession();

    return (
        <FamilySettings session={session} />
    );
}
import { Metadata } from "next";
import InvitePage from "./components/mainInvite";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {

    return createPageMetadata({
        title: "Family Invite",
        description: "Accept a Preserved Recipes invitation and join a family recipe space shared by someone you know.",
        robots: { index: false, follow: false },
    });
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ token: string }>
}) {
    const { token } = await searchParams;
    if (!token) {
        return <section>Error with param</section>
    }

    const userInfo = await getSessionUser();

    return (
            <InvitePage token={token} userInfo={userInfo} />
    );
}

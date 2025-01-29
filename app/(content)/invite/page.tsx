import InvitePage from "@/components/pageSpecifics/invite/invitePage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Register Page`,
        description: `Register page for those invited`
    };
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

    return (
        <InvitePage token={token} />
    );
}
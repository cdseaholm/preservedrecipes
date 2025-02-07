import { Metadata } from "next";
import InvitePage from "./components/mainInvite";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { Suspense } from "react";

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
        <Suspense fallback={<LoadingSpinner screen={true} />}>
            <InvitePage token={token} />
        </Suspense>
    );
}
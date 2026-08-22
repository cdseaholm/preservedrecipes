
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SignInLanding from "@/app/(content)/login/components/sign-in-landing";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Log In",
    description: "Log in to RecipeSafe to manage recipes, family spaces, saved recipes, and account settings.",
    robots: { index: false, follow: true },
});

export default async function Page() {

    const userInfo = await getSessionUser();

    if (userInfo) {
        redirect('/u/profile');
    }

    return (

        <SignInLanding />

    );
}

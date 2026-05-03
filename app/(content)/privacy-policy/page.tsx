import NavWrapper from "@/components/wrappers/navWrapper";
import PrivacyPolicyPage from "./components/privpol-page";
import { getSessionUser } from "@/lib/data/user";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Privacy Policy",
    description: "Learn how Preserved Recipes handles account data, recipe content, family information, and community activity.",
});

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <PrivacyPolicyPage />
        </NavWrapper>
    );
}


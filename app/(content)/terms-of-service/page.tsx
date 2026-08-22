import NavWrapper from "@/components/wrappers/navWrapper";
import TosPage from "./components/tos-page";
import { getSessionUser } from "@/lib/data/user";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Terms of Service",
    description: "Review the RecipeSafe terms for using accounts, recipe tools, family spaces, and shared content.",
});

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <TosPage />
        </NavWrapper>
    );
}


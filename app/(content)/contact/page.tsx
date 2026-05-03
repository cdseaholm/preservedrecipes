import { Metadata } from "next";

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import ContactPage from "./components/contact-page";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {

    return createPageMetadata({
        title: "Contact",
        description: "Contact Preserved Recipes with questions, feedback, support requests, and ideas for improving the recipe-preservation experience.",
    });
}

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <ContactPage />
            </ContentWrapper>
        </NavWrapper>
    );
}

import { Metadata } from "next";
import PricingPage from "./components/pricingPage";
import NavWrapper from "@/components/wrappers/navWrapper";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {

    return createPageMetadata({
        title: "Pricing",
        description: "Compare Preserved Recipes pricing options for saving personal recipes, building family spaces, and sharing collections.",
    });
}

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <PricingPage />
        </NavWrapper>
    );
}

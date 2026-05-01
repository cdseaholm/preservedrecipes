import { Metadata } from "next";
import PricingPage from "./components/pricingPage";
import NavWrapper from "@/components/wrappers/navWrapper";
import { getSessionUser } from "@/lib/data/user";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: 'Preserved Recipes Pricing Page',
        description: "A page for Preserved Recipes' pricing page"
    };
}

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <PricingPage />
        </NavWrapper>
    );
}

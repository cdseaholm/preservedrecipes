import { Metadata } from "next";
import PricingPage from "./components/pricingPage";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: 'Preserved Recipes Pricing Page',
        description: "A page for Preserved Recipes' pricing page"
    };
}

export default async function Page() {

    return (
        <PricingPage />
    );
}
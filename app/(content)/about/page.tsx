import AboutPage from "./components/about-page";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/data/user";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
    title: "About",
    description: "Learn about RecipeSafe and its mission to help families keep meaningful recipes safe.",
});

export default async function Page() {
    try {
        const userInfo = await getSessionUser();

        return (
            <AboutPage userInfo={userInfo} />
        );
        
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

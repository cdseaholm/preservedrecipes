import AboutPage from "./components/about-page";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/data/user";

export const dynamic = 'force-dynamic';

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

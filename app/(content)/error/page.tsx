import ErrorPage from "./components/err-page";
import NavWrapper from "@/components/wrappers/navWrapper";
import { getSessionUser } from "@/lib/data/user";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Something Went Wrong",
    description: "A Preserved Recipes error page for recovering from an issue and returning to the app.",
    robots: { index: false, follow: false },
});

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <ErrorPage />
        </NavWrapper>
    )
}

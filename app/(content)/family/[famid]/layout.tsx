import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { getSessionUser, getFamilyById } from "@/lib/data/family";
import { redirect } from "next/navigation";
import FamilyTabs from "./components/family-tabs";

export default async function FamilyLayout({ params, children }: { params: Promise<{ famid: string }>, children: React.ReactNode }) {
    const { famid } = await params;
    const user = await getSessionUser();
    if (!user) redirect("/");

    const family = await getFamilyById(famid);
    if (!family || family._id !== user.userFamilyID) redirect("/");

    return (
        <NavWrapper loadingChild={null} userInfo={user}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <FamilyTabs family={family} famid={famid}>
                    {children}
                </FamilyTabs>
            </ContentWrapper>
        </NavWrapper>
    )
}
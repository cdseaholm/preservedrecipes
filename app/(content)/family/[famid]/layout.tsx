import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { getSessionUser } from "@/lib/data/user";
import { redirect } from "next/navigation";
import FamilyTabs from "./components/family-tabs";
import FamilyStackTemplate from "./components/family-stack-template";

export default async function FamilyLayout({ params, children }: { params: Promise<{ famid: string }>, children: React.ReactNode }) {

    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);
    const user = await getSessionUser();

    if (!user) redirect("/");

    if (!family || family._id !== user.userFamilyID) redirect("/");

    return (
        <NavWrapper loadingChild={null} userInfo={user}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <FamilyStackTemplate user={user} family={family}>
                    <FamilyTabs famid={famid} />
                    {children}
                </FamilyStackTemplate>
            </ContentWrapper>
        </NavWrapper>
    )
}

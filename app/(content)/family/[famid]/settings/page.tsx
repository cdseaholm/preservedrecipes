import FamilySettings from "../components/settings/family-settings";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type FamilySettingsPageParams = { params: Promise<{ famid: string }> };

export async function generateMetadata({ params }: FamilySettingsPageParams): Promise<Metadata> {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    return createPageMetadata({
        title: `${family.name} Settings`,
        description: `Update family details, preferences, and administration settings for the ${family.name} recipe space.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilySettingsPageParams) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);
    const isAdmin = family.familyMembers
        .find(m => m.familyMemberID.toString() === user._id.toString())
        ?.permissionStatus === 'Admin';
    return <FamilySettings userFamAdminPrivs={isAdmin} family={family} userInfo={user} />
}

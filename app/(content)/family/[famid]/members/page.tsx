import FamilyMembers from "../components/members/family-members";

import { getValidatedFamilyAccess } from "@/lib/data/family";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type FamilyMembersPageParams = { params: Promise<{ famid: string }> };

export async function generateMetadata({ params }: FamilyMembersPageParams): Promise<Metadata> {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    return createPageMetadata({
        title: `${family.name} Members`,
        description: `Manage and view members in the ${family.name} family recipe space on Preserved Recipes.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilyMembersPageParams) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);
    return <FamilyMembers userInfo={user} family={family} />
}

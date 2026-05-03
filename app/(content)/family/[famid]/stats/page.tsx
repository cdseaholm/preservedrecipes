
import FamilyStats from "../components/stats/family-stats";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type FamilyStatsPageParams = { params: Promise<{ famid: string }> };

export async function generateMetadata({ params }: FamilyStatsPageParams): Promise<Metadata> {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    return createPageMetadata({
        title: `${family.name} Stats`,
        description: `Review recipe, member, and activity stats for the ${family.name} family space on Preserved Recipes.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilyStatsPageParams) {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);
    return <FamilyStats family={family} />
}

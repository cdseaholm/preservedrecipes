import FamilyDashboard from "./components/dashboard/dashboard";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type FamilyPageParams = { params: Promise<{ famid: string }> };

export async function generateMetadata({ params }: FamilyPageParams): Promise<Metadata> {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    return createPageMetadata({
        title: `${family.name} Dashboard`,
        description: `View the ${family.name} family recipe dashboard, including family activity, recipes, members, and shared history.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilyPageParams) {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);
    return <FamilyDashboard family={family} />
}

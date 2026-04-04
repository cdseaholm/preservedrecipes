
import FamilyStats from "../components/stats/family-stats";
import { getValidatedFamilyAccess } from "@/lib/data/family";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);
    return <FamilyStats family={family} />
}
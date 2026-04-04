import FamilyDashboard from "./components/dashboard/dashboard";
import { getValidatedFamilyAccess } from "@/lib/data/family";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);
    return <FamilyDashboard family={family} user={user} />
}
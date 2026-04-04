import FamilySettings from "../components/settings/family-settings";
import { getValidatedFamilyAccess } from "@/lib/data/family";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);
    const isAdmin = family.familyMembers
        .find(m => m.familyMemberID.toString() === user._id.toString())
        ?.permissionStatus === 'Admin';
    return <FamilySettings userFamAdminPrivs={isAdmin} family={family} userInfo={user} />
}
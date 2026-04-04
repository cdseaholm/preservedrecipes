import FamilyMembers from "../components/members/family-members";

import { getValidatedFamilyAccess } from "@/lib/data/family";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);
    return <FamilyMembers userInfo={user} family={family} />
}
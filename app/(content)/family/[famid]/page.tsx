import { redirect } from "next/navigation";
import FamilyDashboard from "./components/dashboard/dashboard";
import { getFamilyById } from "@/lib/data/family";
import { toast } from "sonner";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const family = await getFamilyById(famid);
    if (!family) {
        toast.error('Family not found. Please join a family or create one first.')
        redirect('/')
    }
    return <FamilyDashboard family={family} />
}
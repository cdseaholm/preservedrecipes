import { redirect } from 'next/navigation';

type FamilyMemberPageParams = { params: Promise<{ famid: string; id: string }> };

export default async function Page({ params }: FamilyMemberPageParams) {
    const { id } = await params;
    redirect(`/view/member/${id}`);
}

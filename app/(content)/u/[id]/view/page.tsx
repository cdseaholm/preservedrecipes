import { redirect } from "next/navigation";

type UserViewPageParams = { params: Promise<{ id: string }> };

export default async function Page({ params }: UserViewPageParams) {
    const { id } = await params;
    redirect(`/view/member/${id}`);
}

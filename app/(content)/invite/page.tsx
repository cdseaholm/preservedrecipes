import { Metadata } from "next";
import InvitePage from "./components/mainInvite";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Register Page`,
        description: `Register page for those invited`
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ token: string }>
}) {
    const { token } = await searchParams;
    if (!token) {
        return <section>Error with param</section>
    }

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);

    }

    return (
            <InvitePage token={token} userInfo={userInfo} />
    );
}
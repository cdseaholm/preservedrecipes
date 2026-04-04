import { Metadata } from "next";
import PricingPage from "./components/pricingPage";
import NavWrapper from "@/components/wrappers/navWrapper";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: 'Preserved Recipes Pricing Page',
        description: "A page for Preserved Recipes' pricing page"
    };
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);

    }

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <PricingPage />
        </NavWrapper>
    );
}
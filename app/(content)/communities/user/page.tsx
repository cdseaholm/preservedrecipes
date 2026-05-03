
import NavWrapper from "@/components/wrappers/navWrapper"
import UserCommunitiesList from "./components/user-communities";
import connectDB from "@/lib/mongodb";
import Community from "@/models/community";
import { serializeDoc } from "@/utils/data/seralize";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { ICommunity } from "@/models/types/community/community";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "My Communities",
    description: "View the Preserved Recipes communities you belong to and return to shared posts, recipes, and members.",
    robots: { index: false, follow: true },
});

export default async function Page() {

    const user = await getSessionUser();

    if (!user) {
        redirect("/")
    }

    try {
        await connectDB();

        let userCommunities: ICommunity[] = [];
        if (user.communityIDs && user.communityIDs.length > 0) {
            const communityDocs = await Community.find({
                _id: { $in: user.communityIDs.map(id => new ObjectId(id)) }
            }).lean();

            // Serialize all communities
            userCommunities = communityDocs.map(doc => serializeDoc<ICommunity>(doc));
        }

        return (
            <NavWrapper userInfo={user}>
                <UserCommunitiesList userCommunities={userCommunities} />
            </NavWrapper>
        )
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

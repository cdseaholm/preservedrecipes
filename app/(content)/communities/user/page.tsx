
import NavWrapper from "@/components/wrappers/navWrapper"
import { IUser } from "@/models/types/personal/user";
import { getServerSession } from "next-auth";
import UserCommunitiesList from "./components/user-communities";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import Community from "@/models/community";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { ICommunity } from "@/models/types/community/community";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    try {
        await connectDB();

        // Query database directly - no API route needed!
        const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        // Fetch recipes if user has any
        let userCommunities: ICommunity[] = [];
        if (user.communityIDs && user.communityIDs.length > 0) {
            const communityDocs = await Community.find({
                _id: { $in: user.communityIDs.map(id => new ObjectId(id)) }
            }).lean();

            // Serialize all communities
            userCommunities = communityDocs.map(doc => serializeDoc<ICommunity>(doc));
        }

        return (
            <NavWrapper loadingChild={null} userInfo={user}>
                <UserCommunitiesList userCommunities={userCommunities} />
            </NavWrapper>
        )
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}
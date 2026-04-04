

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Community from "@/models/community";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipes/recipe";
import Inquiry from "@/models/inquiry";
import { ICommunity } from "@/models/types/community/community";
import { IInquiry } from "@/models/types/misc/inquiry";
import AccountHistoryPage from "../components/accountHistory";
import Review from "@/models/review";
import { IReview } from "@/models/types/misc/review";

export type UserHistory = {
    user: IUser;
    communitiesCreated: ICommunity[];
    communitiesJoined: ICommunity[];
    recipesCreated: IRecipe[];
    inquiriesMade: IInquiry[];
    reviews: IReview[];
}

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
            return redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);
        const communitiesCreated = [] as ICommunity[];
        const communitiesJoined = [] as ICommunity[];
        const recipesCreated = [] as IRecipe[];
        const inquiriesMade = [] as IInquiry[];


        const communitiesConnected = await Community.find({ members: user._id }).lean() as ICommunity[];
        communitiesConnected.forEach((comm) => {
            const serializedComm = serializeDoc<ICommunity>(comm);
            console.log('Checking validity: ', serializedComm.adminIDs.map((pems) => { console.log('pems.id === user._id', pems === user._id); return pems === user._id }).includes(true));
            if (serializedComm.adminIDs.map((pems) => pems === user._id).includes(true)) {
                if (!communitiesCreated.includes(serializedComm)) {
                    communitiesCreated.push(serializedComm);

                } else if (!communitiesJoined.find(c => c.toString() === serializedComm._id.toString())) {
                    communitiesJoined.push(serializedComm);
                }
            }
        });

        const recipesConnected = await Recipe.find({ creatorID: user._id }).lean() as IRecipe[];
        recipesConnected.forEach((rec) => {
            const serializedRec = serializeDoc<IRecipe>(rec);
            if (serializedRec.creatorID === user._id) {
                if (!recipesCreated.includes(serializedRec)) {
                    recipesCreated.push(serializedRec);
                }
            }
        });

        const inqsConnected = await Inquiry.find({ inquirerEmail: user.email.toString() }).lean() as IInquiry[];
        inqsConnected.forEach((inq) => {
            const serializedInq = serializeDoc<IInquiry>(inq);
            if (serializedInq.inquirerEmail === user.email) {
                if (!inquiriesMade.includes(serializedInq)) {
                    inquiriesMade.push(serializedInq);
                }
            }
        });

        const reviewsDoc = await Review.find({ authorId: user._id }).lean();

        const reviews = reviewsDoc.map(doc => serializeDoc<IReview>(doc));

        const userHistoryToPass = {
            user: user,
            communitiesCreated: communitiesCreated,
            communitiesJoined: communitiesJoined,
            recipesCreated: recipesCreated,
            inquiriesMade: inquiriesMade,
            reviews: reviews,
        } as UserHistory;

        return (
            <AccountHistoryPage userHistory={userHistoryToPass} />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}
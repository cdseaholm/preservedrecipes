import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { redirect } from "next/navigation";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";
import ProfilePage from "../components/profile-page";
import { IReview } from "@/models/types/misc/review";
import Review from "@/models/review";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IInquiry } from "@/models/types/misc/inquiry";
import Community from "@/models/community";
import Inquiry from "@/models/inquiry";
import { ICommunity } from "@/models/types/community/community";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: userName ? `${userName}'s Profile - Preserved Recipes` : 'Profile - Preserved Recipes',
        description: userName ? `Profile page for ${userName} on Preserved Recipes` : 'Profile page on Preserved Recipes',
    };
}

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    try {
        await connectDB();

        // Fetch user
        const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        // Fetch family
        const family = user.userFamilyID ? await Family.findById(user.userFamilyID).lean() : null;
        let familyData = serializeDoc<IFamily | null>(family);

        if (!family || (familyData && familyData._id !== user.userFamilyID)) {
            familyData = null;
        }

        // Fetch reviews
        const reviewsDoc = await Review.find({ authorId: user._id }).lean();
        const reviews = reviewsDoc.map(doc => serializeDoc<IReview>(doc));

        // Fetch recent recipes (last 6)
        const recentRecipesDoc = await Recipe
            .find({ creatorID: user._id })
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();
        const recentRecipes = recentRecipesDoc.map(doc => serializeDoc<IRecipe>(doc));

        // Fetch favorite recipes
        const favoriteRecipesDoc = user.favoriteRecipeIDs && user.favoriteRecipeIDs.length > 0
            ? await Recipe.find({ _id: { $in: user.favoriteRecipeIDs } }).lean()
            : [];
        const favoriteRecipes = favoriteRecipesDoc.map(doc => serializeDoc<IRecipe>(doc));

        // Fetch inquiries
        const inquiriesDoc = await Inquiry.find({ inquirerId: user._id }).lean();
        const inquiries = inquiriesDoc.map(doc => serializeDoc<IInquiry>(doc));

        //Fetch communities created        
        const communitiesCreatedDoc = await Community.find({ creatorId: user._id }).lean();
        const communitiesCreated = communitiesCreatedDoc.map(doc => serializeDoc<ICommunity>(doc));

        //Fetch communities joined
        const communitiesJoinedDoc = user.communityIDs && user.communityIDs.length > 0
            ? await Community.find({ _id: { $in: user.communityIDs } }).lean()
            : [];
        const communitiesJoined = communitiesJoinedDoc.map(doc => serializeDoc<ICommunity>(doc));

        return (
            <ProfilePage 
                user={user} 
                familyData={familyData} 
                reviews={reviews}
                recentRecipes={recentRecipes}
                favoriteRecipes={favoriteRecipes}
                inquiries={inquiries}
                communitiesCreated={communitiesCreated}
                communitiesJoined={communitiesJoined}
            />
        );

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}
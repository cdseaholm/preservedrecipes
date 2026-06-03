import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
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
import Invite from "@/models/invite";
import { ICommunity } from "@/models/types/community/community";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";
import { IInvite } from "@/models/types/misc/invite";
import { isInviteExpired, normalizeInviteEmail } from "@/lib/invite-utils";
import { isInquiryAdminEmail, normalizeAdminEmail } from "@/lib/admin";

export async function generateMetadata(): Promise<Metadata> {
    const user = await getSessionUser();
    const userName = user?.name || '';

    return createPageMetadata({
        title: userName ? `${userName}'s Profile` : "Profile",
        description: userName
            ? `View ${userName}'s Preserved Recipes profile, recipe activity, family space, communities, inquiries, and favorites.`
            : "View your Preserved Recipes profile, recipe activity, family space, communities, inquiries, and favorites.",
        robots: { index: false, follow: true },
    });
}

export default async function Page() {

    const user = await getSessionUser();

    if (!user) {
        redirect("/")
    }

    try {
        await connectDB();

        const normalizedUserEmail = normalizeAdminEmail(user.email);
        const userIsInquiryAdmin = isInquiryAdminEmail(user.email);

        const [
            family,
            reviewsDoc,
            recentRecipesDoc,
            favoriteRecipesDoc,
            inquiriesDoc,
            invitesDoc,
            communitiesCreatedDoc,
            communitiesJoinedDoc,
        ] = await Promise.all([
            user.userFamilyID ? Family.findById(user.userFamilyID).lean() : null,
            Review.find({ authorId: user._id }).lean(),
            Recipe
                .find({ creatorID: user._id })
                .sort({ createdAt: -1 })
                .limit(6)
                .lean(),
            user.favoriteRecipeIDs && user.favoriteRecipeIDs.length > 0
                ? Recipe.find({ _id: { $in: user.favoriteRecipeIDs } }).lean()
                : [],
            userIsInquiryAdmin
                ? Inquiry.find({}).sort({ createdAt: -1 }).lean()
                : Inquiry.find({ inquirerEmail: normalizedUserEmail }).sort({ createdAt: -1 }).lean(),
            Invite.find({ email: normalizeInviteEmail(user.email) }).sort({ createdAt: -1 }).lean(),
            Community.find({ creatorId: user._id }).lean(),
            user.communityIDs && user.communityIDs.length > 0
                ? Community.find({ _id: { $in: user.communityIDs } }).lean()
                : [],
        ]);

        let familyData = serializeDoc<IFamily | null>(family);

        if (!family || (familyData && familyData._id !== user.userFamilyID)) {
            familyData = null;
        }

        const reviews = reviewsDoc.map(doc => serializeDoc<IReview>(doc));
        const recentRecipes = recentRecipesDoc.map(doc => serializeDoc<IRecipe>(doc));
        const favoriteRecipes = favoriteRecipesDoc.map(doc => serializeDoc<IRecipe>(doc));
        const inquiries = inquiriesDoc.map(doc => serializeDoc<IInquiry>(doc));
        const activeInvites = invitesDoc
            .map(doc => serializeDoc<IInvite>(doc))
            .filter(invite => !isInviteExpired(invite));
        const familyActiveInvites = activeInvites.filter(invite => (invite.inviteType || 'family') === 'family');
        const communityActiveInvites = activeInvites.filter(invite => invite.inviteType === 'community');
        const inviteFamilyIds = Array.from(new Set(familyActiveInvites.map(invite => invite.familyID).filter(Boolean)));
        const inviteFamiliesDoc = inviteFamilyIds.length > 0
            ? await Family.find({ _id: { $in: inviteFamilyIds } }).select('name').lean()
            : [];
        const inviteFamilyNames = new Map(
            inviteFamiliesDoc
                .map(doc => serializeDoc<Pick<IFamily, '_id' | 'name'>>(doc))
                .map(family => [family._id.toString(), family.name])
        );
        const familyInvites = familyActiveInvites.map(invite => ({
            ...invite,
            familyName: inviteFamilyNames.get(invite.familyID) || 'Family',
        }));
        const inviteCommunityIds = Array.from(new Set(communityActiveInvites.map(invite => invite.communityID).filter(Boolean)));
        const inviteCommunitiesDoc = inviteCommunityIds.length > 0
            ? await Community.find({ _id: { $in: inviteCommunityIds } }).select('name privacyLevel').lean()
            : [];
        const inviteCommunityNames = new Map(
            inviteCommunitiesDoc
                .map(doc => serializeDoc<Pick<ICommunity, '_id' | 'name'>>(doc))
                .map(community => [community._id.toString(), community.name])
        );
        const communityInvites = communityActiveInvites.map(invite => ({
            ...invite,
            inviteType: 'community' as const,
            communityID: invite.communityID || '',
            communityName: inviteCommunityNames.get(invite.communityID || '') || 'Community',
        }));
        const communitiesCreated = communitiesCreatedDoc.map(doc => serializeDoc<ICommunity>(doc));
        const communitiesJoined = communitiesJoinedDoc.map(doc => serializeDoc<ICommunity>(doc));

        return (
            <ProfilePage 
                user={user} 
                familyData={familyData} 
                reviews={reviews}
                recentRecipes={recentRecipes}
                favoriteRecipes={favoriteRecipes}
                inquiries={inquiries}
                familyInvites={familyInvites}
                communityInvites={communityInvites}
                userIsInquiryAdmin={userIsInquiryAdmin}
                communitiesCreated={communitiesCreated}
                communitiesJoined={communitiesJoined}
            />
        );

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

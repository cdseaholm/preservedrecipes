import { redirect } from 'next/navigation';
import SpecificMemberView from '../../components/members/specificMember';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { IUser } from '@/models/types/personal/user';
import { serializeDoc } from '@/utils/data/seralize';
import { ICommunity } from '@/models/types/community/community';
import { IRecipe } from '@/models/types/recipes/recipe';
import Recipe from '@/models/recipe';
import Community from '@/models/community';
import { IUserView } from '@/models/types/family/member-view';
import Review from '@/models/review';
import { IReview } from '@/models/types/misc/review';
import { getValidatedFamilyAccess } from '@/lib/data/family';
import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';

type FamilyMemberPageParams = { params: Promise<{ famid: string; id: string }> };

export async function generateMetadata({ params }: FamilyMemberPageParams): Promise<Metadata> {
    const { famid, id } = await params;
    const { family } = await getValidatedFamilyAccess(famid);
    const memberFound = family.familyMembers.find(m => m.familyMemberID === id);
    const memberName = memberFound?.familyMemberName || "Family Member";

    return createPageMetadata({
        title: `${memberName} - ${family.name}`,
        description: `View ${memberName}'s shared family member profile, public recipes, reviews, and communities in ${family.name}.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilyMemberPageParams) {

    const { famid, id } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    try {
        
        await connectDB();

        const memberFound = family.familyMembers.find(m => m.familyMemberID === id);

        if (!memberFound) {
            redirect(`/family/${famid}/members`);
        }

        // FIXED: Changed from findOne({ email: id }) to findById(id)
        const userDoc = await User.findById(id).lean() as IUser;

        if (!userDoc) {
            redirect(`/family/${famid}/members`);
        }

        const member = serializeDoc<IUser>(userDoc);

        const [publicCommunityDocs, publicRecipeDocs, reviewsDoc] = await Promise.all([
            member.communityIDs.length > 0
                ? Community.find({ _id: { $in: member.communityIDs }, privacyLevel: 'public' }).lean()
                : [],
            member.recipeIDs.length > 0
                ? Recipe.find({ _id: { $in: member.recipeIDs }, secret: false }).lean()
                : [],
            Review.find({ authorId: member._id }).lean(),
        ]);

        const publicCommunities = publicCommunityDocs.map(doc => serializeDoc<ICommunity>(doc));
        const publicRecipes = publicRecipeDocs.map(doc => serializeDoc<IRecipe>(doc));
        const reviews = reviewsDoc.map(doc => serializeDoc<IReview>(doc));

        const memberToView: IUserView = {
            familyMemberID: member._id.toString(),
            familyMemberName: member.name,
            familyMemberEmail: member.email,
            publicReviews: reviews ? reviews : [] as IReview[],
            publicCommunities: publicCommunities,
            publicRecipes: publicRecipes,
            overlappingCommunities: null,
            sameFamily: family
        };

        return (
            <SpecificMemberView memberToView={memberToView} />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

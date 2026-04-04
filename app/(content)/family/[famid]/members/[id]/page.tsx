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

export default async function Page({ params }: { params: Promise<{ famid: string; id: string }> }) {

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

        const [publicCommunities, publicRecipes] = await Promise.all([
            Promise.all(
                member.communityIDs.map(async (commID) => {
                    const commData = await Community.findById(commID).lean();
                    return commData && commData.privacyLevel === 'public' ? serializeDoc<ICommunity>(commData) : null;
                })
            ).then(results => results.filter(Boolean) as ICommunity[]),

            Promise.all(
                member.recipeIDs.map(async (recipeID) => {
                    const recipeData = await Recipe.findById(recipeID).lean();
                    return recipeData && recipeData.secret === false ? serializeDoc<IRecipe>(recipeData) : null;
                })
            ).then(results => results.filter(Boolean) as IRecipe[])
        ]);

        const reviewsDoc = await Review.find({ authorId: member._id }).lean();

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
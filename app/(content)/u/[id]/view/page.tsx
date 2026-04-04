import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavWrapper from "@/components/wrappers/navWrapper";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ViewPage from "../../components/view-page";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { IUserView } from "@/models/types/family/member-view";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";



export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const userName = user?.name || '';

    return {
        title: userName ? `${userName}'s Recipes - Preserved Recipes` : 'Recipes - Preserved Recipes',
        description: userName ? `Recipe page for ${userName} on Preserved Recipes` : 'Recipe page on Preserved Recipes',
    };
}

export default async function Page({ params }: { params: Promise<{ userid: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    const { userid } = await params;

    if (!userid) {
        redirect("/");
    }

    try {
        await connectDB();

        // Query database directly - no API route needed!
        const userDoc = await User.findOne({ _id: new ObjectId(userid) }).lean() as IUser;

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        if (user._id !== userid) {
            redirect("/");
        }

        if (session.user.email === user.email) {
            redirect("/u/profile");
        }

        let publicCommunities: ICommunity[] = [];

        const communityPromise = Promise.all(
            (user.communityIDs || []).map(async (commID) => {
                const commData = await Community.findById(commID).lean();
                const serializedComm = commData ? serializeDoc<ICommunity>(commData) : null;
                if (serializedComm && serializedComm.privacyLevel === 'public') {
                    publicCommunities.push(serializedComm);
                }
                return serializedComm;
            })
        ).then(results => results.filter(Boolean) as ICommunity[]);

        const publicRecipesPromise = Promise.all(
            (user.recipeIDs || []).map(async (recipeID) => {
                const recipeData = await Recipe.findById(recipeID).lean();
                return recipeData && recipeData.secret === false ? serializeDoc<IRecipe>(recipeData) : null;
            })
        ).then(results => results.filter(Boolean) as IRecipe[]);

        const familyPromise = user.userFamilyID
            ? (async () => {
                const familyData = await Family.findById(user.userFamilyID).lean();
                return familyData ? serializeDoc<IFamily>(familyData) : null;
            })()
            : Promise.resolve(null);

        const [allCommunities, publicRecipes, fetchedFamily] = await Promise.all([
            communityPromise,
            publicRecipesPromise,
            familyPromise
        ]);

        let familyInfo: IFamily | null = fetchedFamily ?? null;
        let overlappingCommunities: ICommunity[] | null = null;

        if (session.user && session.user.email) {
            const viewerDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

            if (viewerDoc) {

                const viewer = serializeDoc<IUser>(viewerDoc);
                const viewCommunityIDs = viewer.communityIDs || [];
                overlappingCommunities = allCommunities.filter(comm => viewCommunityIDs.includes(comm._id));

                if (viewer.userFamilyID && user.userFamilyID && viewer.userFamilyID === user.userFamilyID) {
                    const familyDoc = await Family.findById(user.userFamilyID).lean();
                    if (familyDoc) {
                        familyInfo = serializeDoc<IFamily>(familyDoc);
                    }
                }
            }
        }

        const memberToView: IUserView = {
            familyMemberID: user._id.toString(),
            familyMemberName: user.name,
            familyMemberEmail: user.email,
            publicCommunities: publicCommunities,
            publicReviews: [], // Placeholder, implement if needed
            publicRecipes: publicRecipes,
            overlappingCommunities: overlappingCommunities,
            sameFamily: familyInfo
        };

        return (
            <NavWrapper loadingChild={null} userInfo={user}>
                <ViewPage
                    memberToView={memberToView}
                />
            </NavWrapper>
        );

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}
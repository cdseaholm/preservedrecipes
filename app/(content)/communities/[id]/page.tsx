import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import SpecificCommunityPage from './components/specific-community-page';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import Community from '@/models/community';
import { ICommunity } from '@/models/types/community/community';
import { IPost } from '@/models/types/misc/post';
import Post from '@/models/post';
import Recipe from '@/models/recipe';
import { IRecipe } from '@/models/types/recipes/recipe';
import { isValidObjectId } from 'mongoose';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    const { id } = await params;

    if (!id) {
        redirect("/");
    }

    let userInfo: IUser | null = null;

    try {

        await connectDB();

        if (session && session.user && session.user.email) {
            const userDoc = await User.findOne({ email: session.user.email }).lean();
            userInfo = serializeDoc<IUser>(userDoc);
        }

        const communityDoc = await Community.findById(id).lean() as ICommunity | null;

        if (!communityDoc) {
            redirect("/");
        }

        const community = serializeDoc<ICommunity>(communityDoc);
        const userIsAdmin = userInfo && (community.adminIDs.includes(userInfo._id) || community.creatorID === userInfo._id) ? true : false;
        const userIsMember = userInfo && community.communityMemberIDs.includes(userInfo._id) ? true : false;

        if (community.privacyLevel !== 'public' && (!userIsMember && !userIsAdmin)) {
            redirect("/");
        }

        const creatorDoc = community.creatorID && isValidObjectId(community.creatorID)
            ? await User.findById(community.creatorID).lean()
            : null;

        const validAdminIDs = community.adminIDs.filter(id => id && isValidObjectId(id));
        const adminsDocs = validAdminIDs.length > 0
            ? await User.find({ _id: { $in: validAdminIDs } }).lean()
            : [];
        const userRecipeDocs = await Recipe.find({ creatorID: userInfo?._id }).lean() as IRecipe[] | [];   
        const communityMembers = await User.find({ _id: { $in: community.communityMemberIDs.filter(id => id && isValidObjectId(id)) } }).lean() as IUser[] | [];

        const postsDocs = await Post.find({ relatedToID: community._id }).lean() as IPost[] | [];

        const validRecipeIDs = community.recipeIDs.filter(id => id && isValidObjectId(id));
        const recipeDocs = validRecipeIDs.length > 0
            ? await Recipe.find({ _id: { $in: validRecipeIDs } }).lean()
            : [];

        const creator = creatorDoc ? serializeDoc<IUser>(creatorDoc) : null;
        const admins = adminsDocs ? adminsDocs.map(serializeDoc<IUser>) : [];
        const posts = postsDocs ? postsDocs.map(serializeDoc<IPost>) : [];
        const recipes = recipeDocs ? recipeDocs.map(serializeDoc<IRecipe>) : [];
        const userRecipes = userRecipeDocs ? userRecipeDocs.map(serializeDoc<IRecipe>) : [];
        const members = communityMembers ? communityMembers.map(serializeDoc<IUser>) : [];

        return (
            <SpecificCommunityPage
                community={community}
                creator={creator}
                admins={admins}
                posts={posts}
                recipes={recipes}
                userInfo={userInfo}
                userIsAdmin={userIsAdmin}
                userRecipes={userRecipes}
                members={members}
            />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}
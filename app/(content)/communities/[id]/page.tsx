import { redirect } from 'next/navigation';
import SpecificCommunityPage from './components/specific-community-page';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import Community from '@/models/community';
import { ICommunity } from '@/models/types/community/community';
import { IPost } from '@/models/types/misc/post';
import Post from '@/models/post';
import Request from '@/models/requests';
import { IRequest } from '@/models/types/misc/request';
import Recipe from '@/models/recipe';
import { IRecipe } from '@/models/types/recipes/recipe';
import { isValidObjectId } from 'mongoose';
import { Metadata } from 'next';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';
import { canViewCommunity, isCommunityAdmin } from '@/lib/community-utils';

type CommunityPageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: CommunityPageParams): Promise<Metadata> {
    const { id } = await params;

    try {
        await connectDB();
        const communityDoc = isValidObjectId(id)
            ? await Community.findById(id).select('name description privacyLevel').lean()
            : null;
        const community = communityDoc ? serializeDoc<ICommunity>(communityDoc) : null;

        return createPageMetadata({
            title: community?.name || "Community",
            description: community?.description || "View this RecipeSafe community, including its recipes, posts, members, and shared cooking activity.",
            robots: community?.privacyLevel === 'public' ? undefined : { index: false, follow: true },
        });
    } catch {
        return createPageMetadata({
            title: "Community",
            description: "View a RecipeSafe community and its shared recipes, posts, members, and cooking activity.",
        });
    }
}

export default async function Page({ params }: CommunityPageParams) {

    const userInfo = await getSessionUser();

    if (!userInfo) {
        redirect("/")
    }

    const { id } = await params;

    if (!id) {
        redirect("/");
    }

    try {

        await connectDB();

        const communityDoc = await Community.findById(id).lean() as ICommunity | null;

        if (!communityDoc) {
            redirect("/");
        }

        const community = serializeDoc<ICommunity>(communityDoc);
        const userIsAdmin = isCommunityAdmin(community, userInfo._id);

        if (!canViewCommunity(community, userInfo._id)) {
            redirect("/");
        }

        const validAdminIDs = community.adminIDs.filter(id => id && isValidObjectId(id));
        const validMemberIDs = community.communityMemberIDs.filter(id => id && isValidObjectId(id));
        const validRecipeIDs = community.recipeIDs.filter(id => id && isValidObjectId(id));
        const [
            creatorDoc,
            adminsDocs,
            userRecipeDocs,
            communityMembers,
            postsDocs,
            recipeDocs,
            requestDocs,
        ] = await Promise.all([
            community.creatorID && isValidObjectId(community.creatorID)
                ? User.findById(community.creatorID).lean()
                : null,
            validAdminIDs.length > 0
                ? User.find({ _id: { $in: validAdminIDs } }).lean()
                : [],
            Recipe.find({ creatorID: userInfo._id }).lean(),
            validMemberIDs.length > 0
                ? User.find({ _id: { $in: validMemberIDs } }).lean()
                : [],
            Post.find({ relatedToID: community._id }).lean(),
            validRecipeIDs.length > 0
                ? Recipe.find({ _id: { $in: validRecipeIDs } }).lean()
                : [],
            userIsAdmin && community.requestIDs.length > 0
                ? Request.find({ _id: { $in: community.requestIDs }, status: 'pending' }).sort({ createdAt: -1 }).lean()
                : [],
        ]);

        const creator = creatorDoc ? serializeDoc<IUser>(creatorDoc) : null;
        const admins = adminsDocs ? adminsDocs.map(serializeDoc<IUser>) : [];
        const posts = postsDocs ? postsDocs.map(serializeDoc<IPost>) : [];
        const recipes = recipeDocs ? recipeDocs.map(serializeDoc<IRecipe>) : [];
        const userRecipes = userRecipeDocs ? userRecipeDocs.map(serializeDoc<IRecipe>) : [];
        const members = communityMembers ? communityMembers.map(serializeDoc<IUser>) : [];
        const requests = requestDocs ? requestDocs.map(serializeDoc<IRequest>) : [];

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
                requests={requests}
            />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

import connectDB from "@/lib/mongodb";
import { COMMUNITY_POST_CATEGORIES, COMMUNITY_POST_TYPES, getAuthedUser, isCommunityMember, normalizeCommunityText } from "@/lib/community-utils";
import { NextRequest, NextResponse } from "next/server";
import { IPost } from "@/models/types/misc/post";
import Community from "@/models/community";
import Post from "@/models/post";
import { ICommunity } from "@/models/types/community/community";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: null, communityReturned: null });

    try {
        const body = await req.json();
        await connectDB();

        const postPassed = body.postPassed as IPost;

        if (!postPassed) {
            return NextResponse.json({ status: 400, message: 'No post data', postReturned: null, communityReturned: null });
        }

        const relatedId = postPassed.relatedToID ? postPassed.relatedToID : null;

        if (!relatedId) {
            return NextResponse.json({ status: 400, message: 'No related ID provided', postReturned: null, communityReturned: null });
        }

        if (!COMMUNITY_POST_TYPES.includes(postPassed.type as any)) {
            return NextResponse.json({ status: 400, message: 'Community posts must be recipe shares or text discussions', postReturned: null, communityReturned: null });
        }

        const postTitle = normalizeCommunityText(postPassed.name, 120);
        const postContent = Array.isArray(postPassed.content) ? postPassed.content.map(item => normalizeCommunityText(item, 2000)).filter(Boolean) : [];
        const postCategories = Array.isArray(postPassed.category)
            ? postPassed.category.filter(category => COMMUNITY_POST_CATEGORIES.includes(category as any))
            : [];

        if (!postTitle || postContent.length === 0) {
            return NextResponse.json({ status: 400, message: 'Post title and content are required', postReturned: null, communityReturned: null });
        }

        const community = postPassed.relatedToType === 'community'
            ? await Community.findById(new ObjectId(relatedId)).lean() as ICommunity
            : null;

        if (postPassed.relatedToType === 'community' && !community) {
            return NextResponse.json({ status: 404, message: 'Related community not found', postReturned: null, communityReturned: null });
        }

        if (community && !isCommunityMember(community, user._id.toString())) {
            return NextResponse.json({ status: 403, message: 'Join this community before posting', postReturned: null, communityReturned: null });
        }

        const newPost = await Post.create({
            name: postTitle,
            image: postPassed.image,
            type: postPassed.type,
            creatorID: user._id.toString(),
            relatedToID: postPassed.relatedToID,
            relatedToType: postPassed.relatedToType,
            commentIDs: [],
            ratingsIDs: [],
            category: postCategories.length > 0 ? postCategories : ['recipe-question'],
            content: postContent,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        }) as IPost;

        //I left off here trying to figure out why I was getting this error: "Error creating post: Failed Creation, Related community not found" after selecting a recipe from the list (not creating), and then trying to create post. I think it might be because the relatedToID is not being passed correctly, but I will need to investigate further. For now, I will just return an error if the related community is not found, but I will need to fix this later on.

        if (!newPost) {
            return NextResponse.json({ status: 500, message: 'Error creating post', postReturned: null, communityReturned: null });
        }

        const commPosts = community?.postIDs ? [...community.postIDs, newPost._id.toString()] : [newPost._id.toString()];
        let updatedCommunity: ICommunity | null = null;
        if (postPassed.relatedToType === 'community' && postPassed.relatedToID && community !== null) {
            updatedCommunity = await Community.findByIdAndUpdate(postPassed.relatedToID, { postIDs: commPosts }, { new: true });
        }

        return NextResponse.json({ status: 200, message: 'Success!', postReturned: newPost, communityReturned: updatedCommunity });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating post', postReturned: null, communityReturned: null });
    }
}

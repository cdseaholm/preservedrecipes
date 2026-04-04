import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { IPost } from "@/models/types/misc/post";
import Community from "@/models/community";
import Post from "@/models/post";
import { ICommunity } from "@/models/types/community/community";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: null, communityReturned: null });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: null, communityReturned: null });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: null, communityReturned: null });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', postReturned: null, communityReturned: null });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: null, communityReturned: null });
        }

        const postPassed = body.postPassed as IPost;

        if (!postPassed) {
            return NextResponse.json({ status: 400, message: 'No post data', postReturned: null, communityReturned: null });
        }

        const relatedId = postPassed.relatedToID ? postPassed.relatedToID : null;

        if (!relatedId) {
            return NextResponse.json({ status: 400, message: 'No related ID provided', postReturned: null, communityReturned: null });
        }

        const community = postPassed.relatedToType === 'community'
            ? await Community.findById(new ObjectId(relatedId)).lean() as ICommunity
            : null;

            console.log('Related community:', community, relatedId);

        if (postPassed.relatedToType === 'community' && !community) {
            //Later I will maybe need to think about handling different post types later on, but for now I will just return an error if the related community is not found
            return NextResponse.json({ status: 404, message: 'Related community not found', postReturned: null, communityReturned: null });
        }

        const newPost = await Post.create({
            name: postPassed.name,
            image: postPassed.image,
            type: postPassed.type,
            creatorID: user._id.toString(),
            relatedToID: postPassed.relatedToID,
            relatedToType: postPassed.relatedToType,
            commentIDs: [],
            ratingIDs: [],
            category: postPassed.category,
            content: postPassed.content,
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
            updatedCommunity = await Community.findByIdAndUpdate(postPassed.relatedToID, { postIDs: commPosts });
        }

        return NextResponse.json({ status: 200, message: 'Success!', postReturned: newPost, communityReturned: updatedCommunity });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating post', postReturned: null, communityReturned: null });
    }
}
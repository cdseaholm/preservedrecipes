import { useCommunityStore } from "@/context/communityStore";
import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";
import { readApiResponse } from "../api-response";

export async function AttemptCreatePost({ post }: { post: IPost }): Promise<{ status: boolean, message: string }> {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse === '') {
        return { status: false, message: `App URL is not configured` };
    }

    if (!post) {
        return { status: false, message: `Post data is required` };
    }

    try {

        const res = await fetch(`${urlToUse}/api/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postPassed: post })
        });

        const apiResponse = await readApiResponse<{ postReturned?: IPost; communityReturned?: ICommunity | null }>(res, 'Failed to create post');
        if (!apiResponse.status || !apiResponse.data) return { status: false, message: apiResponse.message };

        const returnedPost = apiResponse.data.postReturned as IPost;

        if (!returnedPost) {
            return { status: false, message: `No post returned` };
        }

        const returnedCommunity = apiResponse.data.communityReturned as ICommunity | null;

        if (returnedCommunity) {
            useCommunityStore.getState().setCommunity(returnedCommunity);
        }

        const currCommPosts = useCommunityStore.getState().communityPosts;
        useCommunityStore.getState().setCommunityPosts([returnedPost, ...currCommPosts]);

        return { status: true, message: `Post created successfully` };

    } catch (error: any) {

        return { status: false, message: `Failed to create post` };

    }
}

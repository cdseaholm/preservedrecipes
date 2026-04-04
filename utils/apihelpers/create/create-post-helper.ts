import { useCommunityStore } from "@/context/communityStore";
import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";

export async function AttemptCreatePost({ post }: { post: IPost }): Promise<{ status: boolean, message: string }> {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse === '') {
        console.log('No URL to use for post creation');
        return { status: false, message: `No URL to use` };
    }

    if (!post) {
        console.log('No post to add');
        return { status: false, message: `No post to add` };
    }

    try {

        const res = await fetch(`${urlToUse}/api/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postPassed: post })
        });

        if (!res || !res.ok) {
            console.log('Response not ok:', res.statusText);
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json();

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        if (data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data.message}` };
        }

        const returnedPost = data.postReturned as IPost;

        if (!returnedPost) {
            return { status: false, message: `Failed Creation, No post returned` };
        }

        const returnedCommunity = data.communityReturned as ICommunity | null;

        if (returnedCommunity) {
            useCommunityStore.getState().setCommunity(returnedCommunity);
        }

        const currCommPosts = useCommunityStore.getState().communityPosts;
        useCommunityStore.getState().setCommunityPosts([returnedPost, ...currCommPosts]);

        return { status: true, message: `Post created successfully` };

    } catch (error: any) {

        console.log('Error creating post:', error);
        return { status: false, message: `Failed Creation, ${error.message}` };

    }
}


import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { serializeDoc } from '@/utils/data/seralize';
import { IPost } from '@/models/types/misc/post';
import Post from '@/models/post';
import PostView from '../components/post-view';
import { Metadata } from 'next';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';

type NestedCommunityPostPageParams = { params: Promise<{ id: string, post_id: string }> };

export async function generateMetadata({ params }: NestedCommunityPostPageParams): Promise<Metadata> {
    const { post_id } = await params;

    try {
        await connectDB();
        const postDoc = await Post.findById(post_id).select('name content').lean();
        const post = postDoc ? serializeDoc<IPost>(postDoc) : null;

        return createPageMetadata({
            title: post?.name || "Community Post",
            description: post?.content?.join(" ").slice(0, 155) || "Read this Preserved Recipes community post and its related recipe conversation.",
        });
    } catch {
        return createPageMetadata({
            title: "Community Post",
            description: "Read this Preserved Recipes community post and its related recipe conversation.",
        });
    }
}

export default async function Page({ params }: NestedCommunityPostPageParams) {

    const { post_id, id } = await params;

    if (!post_id || !id) {
        redirect("/communities");
    }

    const userInfo = await getSessionUser();

    try {

        await connectDB();

        const postDoc = await Post.findById(post_id).lean() as IPost | null;

        if (!postDoc) {
            console.error('Post not found.');
            redirect("/communities");
        }

        if (postDoc.relatedToID !== id) {
            console.error('Post does not belong to the specified community.');
            redirect("/communities");
        }

        const post = serializeDoc<IPost>(postDoc);

        return (
            <PostView post={post} userInfo={userInfo} />
        )
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/communities");
    }
}

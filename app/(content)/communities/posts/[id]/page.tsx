
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { serializeDoc } from '@/utils/data/seralize';
import { IPost } from '@/models/types/misc/post';
import Post from '@/models/post';
import PostView from '../components/post-view';
import { Metadata } from 'next';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';

type CommunityPostPageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: CommunityPostPageParams): Promise<Metadata> {
    const { id } = await params;

    try {
        await connectDB();
        const postDoc = await Post.findById(id).select('name content').lean();
        const post = postDoc ? serializeDoc<IPost>(postDoc) : null;

        return createPageMetadata({
            title: post?.name || "Community Post",
            description: post?.content?.join(" ").slice(0, 155) || "Read this RecipeSafe community post and its related recipe conversation.",
        });
    } catch {
        return createPageMetadata({
            title: "Community Post",
            description: "Read this RecipeSafe community post and its related recipe conversation.",
        });
    }
}

export default async function Page({ params }: CommunityPostPageParams) {

    const { id } = await params;

    if (!id) {
        redirect("/communities");
    }

    const userInfo = await getSessionUser();

    try {

        await connectDB();

        const postDoc = await Post.findById(id).lean() as IPost | null;

        if (!postDoc) {
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

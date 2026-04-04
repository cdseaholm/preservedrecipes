
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import { IPost } from '@/models/types/misc/post';
import Post from '@/models/post';
import PostView from '../components/post-view';

export default async function Page({ params }: { params: Promise<{ id: string, post_id: string }> }) {

    const session = await getServerSession(authOptions);

    const { post_id, id } = await params;

    if (!post_id || !id) {
        redirect("/communities");
    }

    let userInfo: IUser | null = null;

    try {

        await connectDB();

        if (session && session.user && session.user.email) {
            const userDoc = await User.findOne({ email: session.user.email }).lean();
            userInfo = serializeDoc<IUser>(userDoc);
        }

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
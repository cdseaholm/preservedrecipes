import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { ObjectId } from "mongodb";
import { IPost } from "@/models/types/misc/post";
import Community from "@/models/community";
import Post from "@/models/post";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function GET(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || '';

    if (!secret) {
        return NextResponse.json({ status: 401, message: 'Incorrect secret', family: {} as IUser });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: [] as IPost[] });
    }

    try {
        const body = await req.json();
        await connectDB();

        const userSesh = session?.user as User;
        const email = normalizeEmail(userSesh?.email);
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', postReturned: [] as IPost[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', postReturned: [] as IPost[] });
        }

        const communityID = body.communityID as string;

        if (!communityID) {
            return NextResponse.json({ status: 400, message: 'No community ID provided', postReturned: [] as IPost[] });
        }

        if (!user.communityIDs.map(id => id.toString()).includes(communityID)) {
            return NextResponse.json({ status: 403, message: 'You need access to this community to post', postReturned: [] as IPost[] });
        }

        const communityPosts = await Community.findById(new ObjectId(communityID)).select('postIDs').lean() as string[] | null;

        if (!communityPosts) {
            return NextResponse.json({ status: 404, message: 'Community posts not found', postReturned: [] as IPost[] });
        }

        const posts = await Post.find({ _id: { $in: communityPosts.map(id => new ObjectId(id)) } }).lean() as IPost[] | [] as IPost[];

        return NextResponse.json({ status: 200, message: 'Success!', postReturned: posts as IPost[] });

    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', postReturned: [] as IPost[] });
    }
}

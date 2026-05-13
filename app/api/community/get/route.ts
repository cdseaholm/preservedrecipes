import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { authOptions } from "@/lib/auth/auth-options";
import MongoUser from "@/models/user";
import { IUser } from "@/models/types/personal/user";
import { canViewCommunity, normalizeCommunityId } from "@/lib/community-utils";
import { normalizeEmail } from "@/lib/data-normalization";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', communities: [] as ICommunity[] });
    }

    try {
        await connectDB();

        const email = normalizeEmail(session.user.email);
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized', communities: [] as ICommunity[] });
        }

        const user = await MongoUser.findOne({ email }) as IUser | null;
        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', communities: [] as ICommunity[] });
        }

        const communities = await Community.find({}).lean() as ICommunity[];

        if (!communities || communities.length === 0) {
            return NextResponse.json({ status: 404, message: 'No communities found', communities: [] as ICommunity[] })
        }

        const userId = normalizeCommunityId(user._id);
        const viewableCommunities = communities.filter(community => canViewCommunity(community, userId));

        return NextResponse.json({ status: 200, message: 'Success!', communities: viewableCommunities });
    } catch (error) {

        return NextResponse.json({ status: 500, message: 'Internal Server Error', communities: [] as ICommunity[] });
    }
}

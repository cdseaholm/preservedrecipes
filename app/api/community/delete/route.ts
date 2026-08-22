import connectDB from "@/lib/mongodb";
import { getAuthedUser } from "@/lib/community-utils";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Community from "@/models/community";
import Post from "@/models/post";
import Invite from "@/models/invite";
import Request from "@/models/requests";

function response(body: { status: number; message: string }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function DELETE(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || response({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        await connectDB();
        const item = body.itemsToDelete as string;

        if (!item || !ObjectId.isValid(item)) {
            return response({ status: 400, message: 'No community specified' });
        }

        const community = await Community.findById(item);
        if (!community || community.creatorID !== user._id.toString()) {
            return response({ status: 403, message: 'Only the creator can delete this community' });
        }

        const communityPostIds = community.postIDs || [];
        const communityRequestIds = community.requestIDs || [];

        await Promise.all([
            Community.deleteOne({ _id: new ObjectId(item) }),
            MongoUser.updateMany({ communityIDs: item }, { $pull: { communityIDs: item } }),
            Post.deleteMany({
                $or: [
                    { _id: { $in: communityPostIds.filter((id: string) => ObjectId.isValid(id)).map((id: string) => new ObjectId(id)) } },
                    { relatedToType: 'community', relatedToID: item },
                ],
            }),
            Request.deleteMany({
                $or: [
                    { _id: { $in: communityRequestIds.filter((id: string) => ObjectId.isValid(id)).map((id: string) => new ObjectId(id)) } },
                    { 'requestFor.type': 'community', 'requestFor.id': item },
                ],
            }),
            Invite.deleteMany({ inviteType: 'community', communityID: item }),
        ]);

        return response({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return response({ status: 500, message: 'Error deleting community' });
    }
}

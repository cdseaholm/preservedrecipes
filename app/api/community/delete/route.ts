import connectDB from "@/lib/mongodb";
import { getAuthedUser } from "@/lib/community-utils";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Community from "@/models/community";

export async function DELETE(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        await connectDB();
        const item = body.itemsToDelete as string;

        if (!item || !ObjectId.isValid(item)) {
            return NextResponse.json({ status: 400, message: 'No community specified' });
        }

        const community = await Community.findById(item);
        if (!community || community.creatorID !== user._id.toString()) {
            return NextResponse.json({ status: 403, message: 'Only the creator can delete this community' });
        }

        await Community.deleteOne({ _id: new ObjectId(item) });
        await MongoUser.updateMany({ communityIDs: item }, { $pull: { communityIDs: item } });

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}

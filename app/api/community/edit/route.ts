import connectDB from "@/lib/mongodb";
import { getAuthedUser, isCommunityAdmin, sanitizeCommunityPayload } from "@/lib/community-utils";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";

export async function PUT(req: NextRequest) {

    const { error, user } = await getAuthedUser(req);
    if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

    try {
        const body = await req.json();
        await connectDB();
        const item = body.itemToEdit as ICommunity;

        if (!item || !ObjectId.isValid(item._id)) {
            return NextResponse.json({ status: 400, message: 'No community specified' });
        }

        const existing = await Community.findById(item._id) as ICommunity | null;
        if (!existing || !isCommunityAdmin(existing, user._id.toString())) {
            return NextResponse.json({ status: 403, message: 'Admin privileges required' });
        }

        const safeUpdates = sanitizeCommunityPayload(item);

        await Community.updateOne({ _id: new ObjectId(item._id) }, { $set: safeUpdates });

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}

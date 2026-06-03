import connectDB from "@/lib/mongodb";
import { getAuthedUser, isCommunityAdmin, sanitizeCommunityPayload } from "@/lib/community-utils";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { hash } from "bcrypt-ts";

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

        if (safeUpdates.privacyLevel === 'passwordProtected') {
            if (!safeUpdates.communityPassword && !existing.communityPassword) {
                return NextResponse.json({ status: 400, message: 'Password protected communities need a password' });
            }

            if (safeUpdates.communityPassword && safeUpdates.communityPassword !== existing.communityPassword) {
                if (safeUpdates.communityPassword.length < 6) {
                    return NextResponse.json({ status: 400, message: 'Password protected communities need a password' });
                }
                safeUpdates.communityPassword = await hash(safeUpdates.communityPassword, 10);
            } else {
                safeUpdates.communityPassword = existing.communityPassword || '';
            }
        } else {
            safeUpdates.communityPassword = '';
        }

        await Community.updateOne({ _id: new ObjectId(item._id) }, { $set: safeUpdates });

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error editing community' });
    }
}

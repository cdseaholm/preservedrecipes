import { getAuthedUser, getCommunityById, isCommunityMember } from "@/lib/community-utils";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { error, user } = await getAuthedUser(req);
  if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

  try {
    const { communityID } = await req.json();
    const community = await getCommunityById(communityID) as ICommunity | null;

    if (!community) {
      return NextResponse.json({ status: 404, message: 'Community not found' });
    }

    if (!['public', 'hidden'].includes(community.privacyLevel)) {
      return NextResponse.json({ status: 403, message: 'This community requires a request, password, or invite' });
    }

    const userId = user._id.toString();

    if (isCommunityMember(community, userId)) {
      return NextResponse.json({ status: 200, message: 'Already a member', communityReturned: community });
    }

    const [updatedCommunity] = await Promise.all([
      Community.findByIdAndUpdate(
        community._id,
        { $addToSet: { communityMemberIDs: userId } },
        { new: true }
      ),
      MongoUser.updateOne({ _id: userId }, { $addToSet: { communityIDs: community._id.toString() } }),
    ]);

    return NextResponse.json({ status: 200, message: 'Joined community', communityReturned: updatedCommunity });
  } catch {
    return NextResponse.json({ status: 500, message: 'Error joining community' });
  }
}

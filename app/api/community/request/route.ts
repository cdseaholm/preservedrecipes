import { getAuthedUser, getCommunityById, isCommunityAdmin, isCommunityMember, normalizeCommunityText } from "@/lib/community-utils";
import Community from "@/models/community";
import Request from "@/models/requests";
import { ICommunity } from "@/models/types/community/community";
import { IRequest } from "@/models/types/misc/request";
import MongoUser from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { error, user } = await getAuthedUser(req);
  if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

  try {
    const body = await req.json();
    const community = await getCommunityById(body.communityID) as ICommunity | null;
    const message = normalizeCommunityText(body.message, 800);

    if (!community) {
      return NextResponse.json({ status: 404, message: 'Community not found' });
    }

    if (community.privacyLevel !== 'restricted') {
      return NextResponse.json({ status: 400, message: community.privacyLevel === 'private' ? 'Private communities are invite only' : 'This community does not use admin requests' });
    }

    const userId = user._id.toString();
    if (isCommunityMember(community, userId)) {
      return NextResponse.json({ status: 409, message: 'You are already a member' });
    }

    const existing = await Request.findOne({
      requesterID: userId,
      'requestFor.type': 'community',
      'requestFor.id': community._id.toString(),
      status: 'pending',
    }) as IRequest | null;

    if (existing) {
      return NextResponse.json({ status: 200, message: 'Request already pending', requestReturned: existing });
    }

    const request = await Request.create({
      requestFor: { type: 'community', id: community._id.toString() },
      requesterID: userId,
      requesterName: user.name,
      requesterEmail: user.email,
      message,
      status: 'pending',
    }) as IRequest;

    await Community.updateOne({ _id: community._id }, { $addToSet: { requestIDs: request._id.toString() } });

    return NextResponse.json({ status: 200, message: 'Request sent', requestReturned: request });
  } catch {
    return NextResponse.json({ status: 500, message: 'Error sending request' });
  }
}

export async function PATCH(req: NextRequest) {
  const { error, user } = await getAuthedUser(req);
  if (error || !user) return error || NextResponse.json({ status: 401, message: 'Unauthorized' });

  try {
    const { requestID, action } = await req.json();
    if (!['approved', 'rejected'].includes(action)) {
      return NextResponse.json({ status: 400, message: 'Invalid action' });
    }

    const request = await Request.findById(requestID) as IRequest | null;
    if (!request || request.requestFor.type !== 'community') {
      return NextResponse.json({ status: 404, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return NextResponse.json({ status: 409, message: 'This request has already been reviewed' });
    }

    const community = await getCommunityById(request.requestFor.id) as ICommunity | null;
    if (!community || !isCommunityAdmin(community, user._id.toString())) {
      return NextResponse.json({ status: 403, message: 'Admin privileges required' });
    }

    if (community.privacyLevel !== 'restricted') {
      return NextResponse.json({ status: 400, message: 'Only restricted communities can approve join requests' });
    }

    const updateResult = await Request.updateOne({ _id: requestID, status: 'pending' }, { status: action });
    if (updateResult.modifiedCount <= 0) {
      return NextResponse.json({ status: 409, message: 'This request has already been reviewed' });
    }

    if (action === 'approved') {
      await Promise.all([
        Community.updateOne({ _id: community._id }, { $addToSet: { communityMemberIDs: request.requesterID } }),
        MongoUser.updateOne({ _id: request.requesterID }, { $addToSet: { communityIDs: community._id.toString() } }),
      ]);
    }

    return NextResponse.json({ status: 200, message: action === 'approved' ? 'Request approved' : 'Request rejected' });
  } catch {
    return NextResponse.json({ status: 500, message: 'Error updating request' });
  }
}

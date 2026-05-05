import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const COMMUNITY_PRIVACY_LEVELS = ['public', 'private', 'hidden', 'restricted', 'passwordProtected'] as const;
export const COMMUNITY_POST_TYPES = ['recipe', 'text'] as const;
export const COMMUNITY_POST_CATEGORIES = ['recipe-share', 'recipe-question', 'cooking-advice', 'food-story', 'ingredient-help'] as const;

export function normalizeCommunityText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function isCommunityAdmin(community: Pick<ICommunity, 'adminIDs' | 'creatorID'>, userId: string) {
  return community.creatorID === userId || community.adminIDs.includes(userId);
}

export function isCommunityMember(community: Pick<ICommunity, 'adminIDs' | 'creatorID' | 'communityMemberIDs'>, userId: string) {
  return isCommunityAdmin(community, userId) || community.communityMemberIDs.includes(userId);
}

export function canViewCommunity(community: ICommunity, userId?: string) {
  if (community.privacyLevel === 'public') return true;
  return !!userId && isCommunityMember(community, userId);
}

export function sanitizeCommunityPayload(community: Partial<ICommunity>) {
  const privacyLevel = COMMUNITY_PRIVACY_LEVELS.includes(community.privacyLevel as any)
    ? community.privacyLevel
    : 'public';

  return {
    name: normalizeCommunityText(community.name, 80),
    description: normalizeCommunityText(community.description, 600),
    privacyLevel,
    tags: Array.isArray(community.tags)
      ? Array.from(new Set(community.tags.map(tag => normalizeCommunityText(tag, 32)).filter(Boolean))).slice(0, 8)
      : [],
    communityPassword: community.communityPassword || '',
  };
}

export async function getAuthedUser(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || '';
  if (!secret) {
    return { error: NextResponse.json({ status: 401, message: 'Unauthorized' }), user: null as IUser | null };
  }

  const [session, token] = await Promise.all([
    getServerSession(authOptions),
    getToken({ req, secret }),
  ]);

  const email = session?.user?.email?.trim().toLowerCase() || '';
  if (!session || !token || !email) {
    return { error: NextResponse.json({ status: 401, message: 'Unauthorized' }), user: null as IUser | null };
  }

  await connectDB();
  const user = await MongoUser.findOne({ email }) as IUser | null;
  if (!user || user._id.toString() !== token.sub) {
    return { error: NextResponse.json({ status: 401, message: 'Unauthorized' }), user: null as IUser | null };
  }

  return { error: null, user };
}

export async function getCommunityById(communityId: string) {
  if (!ObjectId.isValid(communityId)) return null;
  return await Community.findById(communityId) as ICommunity | null;
}

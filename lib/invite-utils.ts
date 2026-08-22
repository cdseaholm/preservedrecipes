import Invite from "@/models/invite";
import Family from "@/models/family";
import MongoUser from "@/models/user";
import { IFamily } from "@/models/types/family/family";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IInvite } from "@/models/types/misc/invite";
import { IUser } from "@/models/types/personal/user";
import { ObjectId } from "mongodb";
import { normalizeEmail } from "./data-normalization";

export const INVITE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeInviteEmail(email: string | null | undefined) {
  return normalizeEmail(email);
}

export function isInviteExpired(invite: Pick<IInvite, "createdAt">) {
  const createdAt = new Date(invite.createdAt).getTime();
  return Number.isNaN(createdAt) || Date.now() - createdAt > INVITE_EXPIRATION_MS;
}

export function serializeInvite(invite: IInvite) {
  return {
    email: invite.email,
    inviteType: invite.inviteType || "family",
    familyID: invite.familyID,
    communityID: invite.communityID || "",
    token: invite.token,
    createdAt: invite.createdAt,
  } as IInvite;
}

export async function findValidInviteByToken(token: string) {
  const invite = await Invite.findOne({ token }) as IInvite | null;

  if (!invite) {
    return { invite: null, message: "Invalid or expired invite token" };
  }

  if (isInviteExpired(invite)) {
    await removePendingInviteMember(invite);
    await Invite.deleteOne({ token });
    return { invite: null, message: "Expired invite token" };
  }

  return { invite, message: "Invite found" };
}

export async function removePendingInviteMember(invite: IInvite) {
  if (!ObjectId.isValid(invite.familyID)) return;

  await Family.updateOne(
    { _id: new ObjectId(invite.familyID) },
    {
      $pull: {
        familyMembers: {
          familyMemberEmail: normalizeInviteEmail(invite.email),
          memberConnected: false,
        },
      },
    }
  );
}

export async function acceptFamilyInviteForUser(invite: IInvite, user: IUser) {
  const email = normalizeInviteEmail(invite.email);
  const userEmail = normalizeInviteEmail(user.email);
  const userId = user._id.toString();

  if (!email || email !== userEmail) {
    return { success: false, status: 403, message: "Sign in as the invited user to accept this invite", members: [] as IFamilyMember[] };
  }

  if (!ObjectId.isValid(invite.familyID)) {
    return { success: false, status: 400, message: "Invalid family id", members: [] as IFamilyMember[] };
  }

  if (user.userFamilyID && user.userFamilyID !== invite.familyID) {
    return { success: false, status: 406, message: "User must leave current family to accept this invite", members: [] as IFamilyMember[] };
  }

  const famObjectID = new ObjectId(invite.familyID);
  const family = await Family.findOne({ _id: famObjectID }) as IFamily | null;

  if (!family) {
    return { success: false, status: 404, message: "Family not found", members: [] as IFamilyMember[] };
  }

  const famMembers = family.familyMembers || [] as IFamilyMember[];
  const pendingOrExistingMember = famMembers.find(member =>
    normalizeInviteEmail(member.familyMemberEmail) === email ||
    member.familyMemberID === userId
  );
  const membersWithoutInvitee = famMembers.filter(member =>
    normalizeInviteEmail(member.familyMemberEmail) !== email &&
    member.familyMemberID !== userId
  );

  const connectedMember = {
    familyMemberID: userId,
    familyMemberName: user.name || email.split("@")[0],
    familyMemberEmail: email,
    permissionStatus: pendingOrExistingMember?.permissionStatus || "Member",
    memberConnected: true,
  } as IFamilyMember;

  const updatedMembers = [
    ...membersWithoutInvitee,
    connectedMember,
  ] as IFamilyMember[];

  await Promise.all([
    MongoUser.updateOne({ _id: new ObjectId(userId) }, { $set: { userFamilyID: invite.familyID } }),
    Family.updateOne({ _id: famObjectID }, { $set: { familyMembers: updatedMembers } }),
    Invite.deleteOne({ token: invite.token }),
  ]);

  return { success: true, status: 200, message: "Invite accepted", members: updatedMembers };
}

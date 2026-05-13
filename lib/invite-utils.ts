import Invite from "@/models/invite";
import Family from "@/models/family";
import { IInvite } from "@/models/types/misc/invite";
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
    familyID: invite.familyID,
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

import connectDB from "@/lib/mongodb";
import { findValidInviteByToken, normalizeInviteEmail } from "@/lib/invite-utils";
import Family from '@/models/family';
import Invite from '@/models/invite';
import { IFamily } from '@/models/types/family/family';
import { IFamilyMember } from '@/models/types/family/familyMember';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const normalizedEmail = normalizeInviteEmail(body.emailPassed);

    if (!normalizedEmail) {
      return NextResponse.json({ status: 402, message: "Email is required", newUser: {} as IUser });
    }
    if (!body.saltedPW) {
      return NextResponse.json({ status: 403, message: "Password is required", newUser: {} as IUser });
    }
    if (!body.namePassed) {
      return NextResponse.json({ status: 402, message: "Name is required", newUser: {} as IUser });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ status: 404, message: "User already exists", newUser: {} as IUser });
    }

    const inviteToken = typeof body.invite?.token === 'string' ? body.invite.token : '';
    const inviteLookup = inviteToken ? await findValidInviteByToken(inviteToken) : null;
    const invite = inviteLookup?.invite || null;

    if (inviteToken && !invite) {
      return NextResponse.json({ status: 400, message: inviteLookup?.message || "Invalid invite", newUser: {} as IUser });
    }

    const userFamID = invite !== null ? invite.familyID : '';

    if (invite !== null) {
      if (normalizedEmail !== normalizeInviteEmail(invite.email)) {
        return NextResponse.json({ status: 403, message: "Register with the invited email address", newUser: {} as IUser });
      }

      if (!ObjectId.isValid(invite.familyID)) {
        return NextResponse.json({ status: 400, message: 'Invalid family id', newUser: {} as IUser });
      }

      const famObjectID = new ObjectId(invite.familyID);
      const thisFam = await Family.findOne({ _id: famObjectID }) as IFamily;

      if (!thisFam) {
        return NextResponse.json({ status: 404, message: 'Family not found', newUser: {} as IUser });
      }

      const famMembers = thisFam.familyMembers;
      const memberToChange = famMembers.find((member) => normalizeInviteEmail(member.familyMemberEmail) === normalizedEmail);

      if (!memberToChange) {
        return NextResponse.json({ status: 404, message: 'Family member not found', returnedMembers: [] as IFamilyMember[] });
      }
    }

    const user = await User.create({
      name: body.namePassed,
      email: normalizedEmail,
      password: body.saltedPW,
      userFamilyID: userFamID,
      recipeIDs: [] as string[],
      savedRecipeIDs: [] as string[],
      favoriteRecipeIDs: [] as string[],
      communityIDs: [] as string[],
      bio: '',
      profileImage: '',
      resetPasswordExpires: '',
      resetPasswordToken: '',
    }) as IUser;

    if (!user) {
      return NextResponse.json({ status: 406, message: "Error creating user", newUser: {} as IUser });
    }

    if (invite !== null) {
      const famObjectID = new ObjectId(invite.familyID);
      const thisFam = await Family.findOne({ _id: famObjectID }) as IFamily;
      const famMembers = thisFam.familyMembers;
      const famMembersWithout = famMembers.filter((member) => normalizeInviteEmail(member.familyMemberEmail) !== normalizedEmail);
      const memberToChange = famMembers.find((member) => normalizeInviteEmail(member.familyMemberEmail) === normalizedEmail);

      if (!memberToChange) {
        return NextResponse.json({ status: 404, message: 'Family member not found', newUser: {} as IUser });
      }

      const newMember = {
        ...memberToChange,
        familyMemberID: user._id.toString(),
        familyMemberName: user.name,
        familyMemberEmail: normalizedEmail,
        memberConnected: true
      } as IFamilyMember;

      const updatedMembers = [
        ...famMembersWithout,
        newMember
      ] as IFamilyMember[];

      await Family.updateOne({ _id: famObjectID }, { $set: { familyMembers: updatedMembers } });

      await Invite.deleteOne({ token: invite.token });
    }

    return NextResponse.json({ status: 200, message: "Success!", newUser: JSON.parse(JSON.stringify(user)) as IUser });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      return NextResponse.json({ status: 404, message: "User already exists", newUser: {} as IUser });
    }
    return NextResponse.json({ status: 500, message: "Error catch", newUser: {} as IUser });
  }
}

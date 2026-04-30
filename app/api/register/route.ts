import connectDB from "@/lib/mongodb";
import Family from '@/models/family';
import Invite from '@/models/invite';
import { IFamily } from '@/models/types/family/family';
import { IFamilyMember } from '@/models/types/family/familyMember';
import { IInvite } from "@/models/types/misc/invite";
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const normalizedEmail = body.emailPassed?.trim().toLowerCase();

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

    const invite = body.invite as null | IInvite ? body.invite as IInvite : null;

    const userFamID = invite !== null ? invite.familyID : '';

    if (invite !== null) {
      const famObjectID = new ObjectId(invite.familyID);
      const thisFam = await Family.findOne({ _id: famObjectID }) as IFamily;
      const famMembers = thisFam.familyMembers;
      const famMembersWithout = famMembers.filter((member) => member.familyMemberEmail !== invite.email);
      const memberToChange = famMembers.find((member) => member.familyMemberEmail === invite.email);

      if (!memberToChange) {
        return NextResponse.json({ status: 404, message: 'Family member not found', returnedMembers: [] as IFamilyMember[] });
      }

      const newMember = {
        ...memberToChange,
        memberConnected: true
      } as IFamilyMember;

      const updatedMembers = [
        ...famMembersWithout,
        newMember
      ] as IFamilyMember[];

      await Family.updateOne({ _id: famObjectID }, { $set: { familyMembers: updatedMembers } });

      await Invite.deleteOne({ token: invite.token });
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

    return NextResponse.json({ status: 200, message: "Success!", newUser: JSON.parse(JSON.stringify(user)) as IUser });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      return NextResponse.json({ status: 404, message: "User already exists", newUser: {} as IUser });
    }
    return NextResponse.json({ status: 500, message: "Error catch", newUser: {} as IUser });
  }
}

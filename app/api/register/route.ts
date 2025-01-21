import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/user';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    if (!body.emailPassed) {
      return NextResponse.json({ status: 402, message: "Email is required", newUser: {} as IUser });
    }
    if (!body.saltedPW) {
      return NextResponse.json({ status: 403, message: "Password is required", newUser: {} as IUser });
    }
    if (!body.namePassed) {
      return NextResponse.json({ status: 402, message: "Name is required", newUser: {} as IUser });
    }

    const existingUser = await User.findOne({ email: body.emailPassed });

    if (existingUser) {
      return NextResponse.json({ status: 404, message: "User already exists", newUser: {} as IUser });
    }

    const user = await User.create({
      name: body.namePassed,
      email: body.emailPassed,
      password: body.saltedPW,
      userFamilyID: '',
      recipeIDs: [] as string[],
      communityIDs: [] as string[],
      ratings: [] as number[],
    }) as IUser;

    if (!user) {
      return NextResponse.json({ status: 406, message: "Error creating user", newUser: {} as IUser });
    }

    return NextResponse.json({ status: 200, message: "Success!", newUser: user as IUser });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 500, message: "Error catch", newUser: {} as IUser });
  }
}
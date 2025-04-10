import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { revalidatePath } from "next/cache";
import Family from "@/models/family";

export async function PUT(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        const newName = body.newName as string;
        const famId = body.famId as string;
        await connectDB();
        const userSesh = session?.user as User;
        const userID = userSesh ? userSesh.email : '';
        if (userID === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: userID }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        await Family.updateOne({ _id: famId }, { $set: { name: newName } });


        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error editing user' });
    }
}
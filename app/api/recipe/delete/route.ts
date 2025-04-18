import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {

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
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const items = body.itemsToDelete as IRecipe[];

        const deletePromises = items.map(async (item: IRecipe) => {
            await Recipe.deleteOne({ _id: new ObjectId(item._id) });
        });

        await Promise.all(deletePromises);

        const newUserIDs = user.recipeIDs.filter((id: string) => !items.some((item: IRecipe) => item._id === id));

        await MongoUser.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { recipeIDs: newUserIDs } }
        );

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}
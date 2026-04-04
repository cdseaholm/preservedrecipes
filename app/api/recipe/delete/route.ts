import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { ObjectId } from "mongodb";
import Family from "@/models/family";

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

        const items = body.itemsToDelete as string[];

        if (items.length === 0) {
            return NextResponse.json({ status: 400, message: 'No items to delete' });
        }

        const deletePromises = items.map(async (item: string) => {
            await Recipe.deleteOne({ _id: new ObjectId(item) });
        });

        await Promise.all(deletePromises);

        const newUserIDs = user.recipeIDs.filter((id: string) => !items.some((item: string) => item === id));

        await MongoUser.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { recipeIDs: newUserIDs } }
        );

        if (user.userFamilyID) {
            const family = await Family.findById(user.userFamilyID);
            if (family) {
                const newFamilyRecipeIDs = family.recipeIDs.filter((id: string) => !items.some((item: string) => item === id));
                await Family.updateOne(
                    { _id: new ObjectId(family._id) },
                    { $set: { recipeIDs: newFamilyRecipeIDs } }
                );
            }
        }

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error deleting recipe' });
    }
}
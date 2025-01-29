import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { revalidatePath } from "next/cache";
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

        const familyID = user.userFamilyID;
        if (familyID !== '') {
            await Family.updateOne(
                { _id: new ObjectId(familyID) },
                { $pull: { familyMembers: { familyMemberID: user._id.toString() } } }
            );
        }

        const deleteRecipePromises = user.recipeIDs.map(async (id: string) => {
            await Recipe.deleteOne({ _id: new ObjectId(id) });
        });
        await Promise.all(deleteRecipePromises);


        await MongoUser.deleteOne({ _id: new ObjectId(user._id) })

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}
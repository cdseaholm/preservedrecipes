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
import { IFamily } from "@/models/types/family";
import Family from "@/models/family";
import { IFamilyMember } from "@/models/types/familyMember";

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
            console.log("User not found");
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const item = body.itemsToDelete as IFamily;

        const deleteMemberPromises = item.familyMembers.map(async (member: IFamilyMember) => {
            const memberID = new ObjectId(member.familyMemberID)
            await MongoUser.updateOne({ _id: memberID }, { $set: { userFamilyID: '' } });
        });

        await Promise.all(deleteMemberPromises);

        const deleteRecipePromises = item.recipes.map(async (recipe: IRecipe) => {
            const recipeID = new ObjectId(recipe._id)
            await Recipe.deleteOne({ _id: recipeID });
        });

        await Promise.all(deleteRecipePromises);

        await Family.deleteOne({ _id: new ObjectId(item._id) });

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        console.error('Error creating recipe:', error);
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}
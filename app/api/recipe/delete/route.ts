import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Family from "@/models/family";
import { authOptions } from "@/lib/auth/auth-options";
import { normalizeEmail } from "@/lib/data-normalization";

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        await connectDB();
        const email = normalizeEmail(session.user.email);
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const items = body.itemsToDelete as string[];

        if (!items || items.length === 0) {
            return NextResponse.json({ status: 400, message: 'No items to delete' });
        }

        const validItems = Array.from(new Set(items)).filter(item => ObjectId.isValid(item));
        if (validItems.length !== items.length) {
            return NextResponse.json({ status: 400, message: 'Invalid recipe ID' });
        }

        const ownedRecipes = await Recipe.find({
            _id: { $in: validItems.map(item => new ObjectId(item)) },
            creatorID: user._id.toString(),
        }).select('_id').lean();

        if (ownedRecipes.length !== validItems.length) {
            return NextResponse.json({ status: 403, message: 'Only recipes you created can be deleted' });
        }

        await Recipe.deleteMany({
            _id: { $in: validItems.map(item => new ObjectId(item)) },
            creatorID: user._id.toString(),
        });

        const newUserIDs = user.recipeIDs.filter((id: string) => !validItems.some((item: string) => item === id));

        await MongoUser.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { recipeIDs: newUserIDs } }
        );

        if (user.userFamilyID) {
            const family = await Family.findById(user.userFamilyID);
            if (family) {
                const newFamilyRecipeIDs = family.recipeIDs.filter((id: string) => !validItems.some((item: string) => item === id));
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

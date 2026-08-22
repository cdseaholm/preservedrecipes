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
import Community from "@/models/community";
import Post from "@/models/post";

function response(body: { status: number; message: string }, status = body.status) {
    return NextResponse.json(body, { status });
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return response({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        await connectDB();
        const email = normalizeEmail(session.user.email);
        if (email === '') {
            return response({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return response({ status: 404, message: 'User not found' });
        }

        const items = body.itemsToDelete as string[];

        if (!items || items.length === 0) {
            return response({ status: 400, message: 'No items to delete' });
        }

        const validItems = Array.from(new Set(items)).filter(item => ObjectId.isValid(item));
        if (validItems.length !== items.length) {
            return response({ status: 400, message: 'Invalid recipe ID' });
        }

        const ownedRecipes = await Recipe.find({
            _id: { $in: validItems.map(item => new ObjectId(item)) },
            creatorID: user._id.toString(),
        }).select('_id').lean();

        if (ownedRecipes.length !== validItems.length) {
            return response({ status: 403, message: 'Only recipes you created can be deleted' });
        }

        const relatedPosts = await Post.find({
            relatedToType: 'recipe',
            relatedToID: { $in: validItems },
        }).select('_id').lean();
        const relatedPostIds = relatedPosts.map(post => post._id.toString());

        await Recipe.deleteMany({
            _id: { $in: validItems.map(item => new ObjectId(item)) },
            creatorID: user._id.toString(),
        });

        const newUserIDs = user.recipeIDs.filter((id: string) => !validItems.some((item: string) => item === id));

        await MongoUser.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { recipeIDs: newUserIDs } }
        );

        await Promise.all([
            Family.updateMany(
                { recipeIDs: { $in: validItems } },
                { $pull: { recipeIDs: { $in: validItems } } }
            ),
            Community.updateMany(
                { $or: [{ recipeIDs: { $in: validItems } }, { postIDs: { $in: relatedPostIds } }] },
                { $pull: { recipeIDs: { $in: validItems }, postIDs: { $in: relatedPostIds } } }
            ),
            MongoUser.updateMany(
                {},
                {
                    $pull: {
                        savedRecipeIDs: { $in: validItems },
                        favoriteRecipeIDs: { $in: validItems },
                    },
                }
            ),
            relatedPostIds.length
                ? Post.deleteMany({ _id: { $in: relatedPostIds.map(id => new ObjectId(id)) } })
                : Promise.resolve(),
        ]);

        return response({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return response({ status: 500, message: 'Error deleting recipe' });
    }
}

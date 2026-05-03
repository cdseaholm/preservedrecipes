import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth/auth-options";
import Recipe from "@/models/recipe";
import User from "@/models/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IUser } from "@/models/types/personal/user";
import { serializeDoc } from "@/utils/data/seralize";
import RecipeDetail from "./components/recipe-detail";
import { createPageMetadata } from "@/lib/metadata";

type RecipeViewPageParams = {
    params: Promise<{ recipeid: string }>;
};

function userCanViewRecipe(recipe: IRecipe, user: IUser | null) {
    if (!recipe.secret) return true;
    if (!user) return false;
    if (recipe.creatorID === user._id) return true;
    return recipe.secretViewerIDs?.includes(user._id) || recipe.secretViewerIDs?.includes(user.email);
}

async function getRecipeViewData(recipeid: string) {
    if (!ObjectId.isValid(recipeid)) {
        notFound();
    }

    await connectDB();

    const session = await getServerSession(authOptions);
    const [recipeDoc, currentUserDoc] = await Promise.all([
        Recipe.findById(recipeid).lean(),
        session?.user?.email ? User.findOne({ email: session.user.email }).lean() : null,
    ]);

    if (!recipeDoc) {
        notFound();
    }

    const recipe = serializeDoc<IRecipe>(recipeDoc);
    const currentUser = currentUserDoc
        ? { ...serializeDoc<IUser>(currentUserDoc), password: '' }
        : null;

    if (!userCanViewRecipe(recipe, currentUser)) {
        notFound();
    }

    const creatorDoc = recipe.creatorID && ObjectId.isValid(recipe.creatorID)
        ? await User.findById(recipe.creatorID).select('name').lean()
        : null;

    return {
        recipe,
        currentUser,
        creatorName: creatorDoc?.name || 'Deleted User',
    };
}

export async function generateMetadata({ params }: RecipeViewPageParams): Promise<Metadata> {
    const { recipeid } = await params;

    if (!ObjectId.isValid(recipeid)) {
        return createPageMetadata({
            title: "Recipe",
            description: "View a preserved recipe, including ingredients, steps, notes, and recipe details.",
        });
    }

    try {
        await connectDB();
        const recipeDoc = await Recipe.findById(recipeid).select('name description secret').lean();
        const recipe = recipeDoc ? serializeDoc<Pick<IRecipe, 'name' | 'description' | 'secret'>>(recipeDoc) : null;

        return createPageMetadata({
            title: recipe?.name || "Recipe",
            description: recipe?.description || "View this preserved recipe, including ingredients, steps, notes, and recipe details.",
            robots: recipe?.secret ? { index: false, follow: true } : undefined,
        });
    } catch {
        return createPageMetadata({
            title: "Recipe",
            description: "View a preserved recipe, including ingredients, steps, notes, and recipe details.",
        });
    }
}

export default async function Page({ params }: RecipeViewPageParams) {
    const { recipeid } = await params;
    const { recipe, currentUser, creatorName } = await getRecipeViewData(recipeid);

    return (
        <RecipeDetail
            recipe={recipe}
            currentUser={currentUser}
            creatorName={creatorName}
        />
    );
}

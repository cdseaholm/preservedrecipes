import { Metadata } from "next";
import { IRecipe } from "@/models/types/recipes/recipe";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { ObjectId } from "mongodb";
import { serializeDoc } from "@/utils/data/seralize";
import { redirect } from "next/navigation";
import RecipePage from "../components/recipe-page";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

// ✅ Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Don't cache

function getValidObjectIds(ids: string[] = []) {
    return Array.from(new Set(ids))
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id));
}

function sanitizeRecipeForUser(recipe: IRecipe, userId: string) {
    if (recipe.creatorID === userId) {
        return recipe;
    }

    return {
        ...recipe,
        secretViewerIDs: [],
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const user = await getSessionUser();
    const userName = user?.name || '';

    return createPageMetadata({
        title: userName ? `${userName}'s Recipes` : "My Recipes",
        description: userName
            ? `Manage ${userName}'s RecipeSafe collection, including created, favorite, saved, public, and private recipes.`
            : "Manage your RecipeSafe collection, including created, favorite, saved, public, and private recipes.",
        robots: { index: false, follow: true },
    });
}

export default async function Page() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/")
    }

    try {
        await connectDB();

        const recipeIdSet = new Set<string>();
        let allMixedRecipes: IRecipe[] = [];

        const viewerIds = [user._id, user.email].filter(Boolean);
        const mixedRecipeIds = getValidObjectIds([
            ...(user.recipeIDs || []),
            ...(user.favoriteRecipeIDs || []),
            ...(user.savedRecipeIDs || []),
        ]);

        const recipeDocs = mixedRecipeIds.length > 0
            ? await Recipe.find({
                _id: { $in: mixedRecipeIds },
                $or: [
                    { secret: { $ne: true } },
                    { creatorID: user._id },
                    { secretViewerIDs: { $in: viewerIds } },
                ],
            }).lean()
            : [];

        recipeDocs.forEach(doc => {
            const recipe = sanitizeRecipeForUser(serializeDoc<IRecipe>(doc), user._id);
            if (!recipeIdSet.has(recipe._id)) {
                recipeIdSet.add(recipe._id);
                allMixedRecipes.push(recipe);
            }
        });

        return (
            <RecipePage
                allMixedRecipes={allMixedRecipes}
                userInfo={user}
                ingredients={[]}
            />
        );
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

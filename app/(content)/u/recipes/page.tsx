import { Metadata } from "next";
import { IRecipe } from "@/models/types/recipes/recipe";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { ObjectId } from "mongodb";
import { serializeDoc } from "@/utils/data/seralize";
import { redirect } from "next/navigation";
import Ingredient from "@/models/ingredient";
import { IIngredient } from "@/models/types/recipes/ingredient";
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
            ? `Manage ${userName}'s Preserved Recipes collection, including created, favorite, saved, public, and private recipes.`
            : "Manage your Preserved Recipes collection, including created, favorite, saved, public, and private recipes.",
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
        const viewableRecipeFilter = {
            $or: [
                { secret: { $ne: true } },
                { creatorID: user._id },
                { secretViewerIDs: { $in: viewerIds } },
            ],
        };

        const [
            recipeDocs,
            favoriteRecipeDocs,
            savedRecipeDocs,
            ingredientDocs,
        ] = await Promise.all([
            user.recipeIDs && user.recipeIDs.length > 0
                ? Recipe.find({
                    _id: { $in: getValidObjectIds(user.recipeIDs) },
                    creatorID: user._id,
                }).lean()
                : [],
            user.favoriteRecipeIDs && user.favoriteRecipeIDs.length > 0
                ? Recipe.find({
                    _id: { $in: getValidObjectIds(user.favoriteRecipeIDs) },
                    ...viewableRecipeFilter,
                }).lean()
                : [],
            user.savedRecipeIDs && user.savedRecipeIDs.length > 0
                ? Recipe.find({
                    _id: { $in: getValidObjectIds(user.savedRecipeIDs) },
                    ...viewableRecipeFilter,
                }).lean()
                : [],
            Ingredient.find({}).lean(),
        ]);

        recipeDocs.forEach(doc => {
            const recipe = sanitizeRecipeForUser(serializeDoc<IRecipe>(doc), user._id);
            recipeIdSet.add(recipe._id);
            allMixedRecipes.push(recipe);
        });

        favoriteRecipeDocs.forEach(doc => {
            const recipe = sanitizeRecipeForUser(serializeDoc<IRecipe>(doc), user._id);
            if (!recipeIdSet.has(recipe._id)) {
                recipeIdSet.add(recipe._id);
                allMixedRecipes.push(recipe);
            }
        });

        savedRecipeDocs.forEach(doc => {
            const recipe = sanitizeRecipeForUser(serializeDoc<IRecipe>(doc), user._id);
            if (!recipeIdSet.has(recipe._id)) {
                recipeIdSet.add(recipe._id);
                allMixedRecipes.push(recipe);
            }
        });
        const ingredients = ingredientDocs.map(doc => serializeDoc<IIngredient>(doc));

        return (
            <RecipePage
                allMixedRecipes={allMixedRecipes}
                userInfo={user}
                ingredients={ingredients}
            />
        );
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}

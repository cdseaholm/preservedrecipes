import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IUser } from "@/models/types/personal/user";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/recipe";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { redirect } from "next/navigation";
import Ingredient from "@/models/ingredient";
import { IIngredient } from "@/models/types/recipes/ingredient";
import RecipePage from "../components/recipe-page";

// ✅ Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Don't cache

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const userName = user?.name || '';

    return {
        title: userName ? `${userName}'s Recipes - Preserved Recipes` : 'Recipes - Preserved Recipes',
        description: userName ? `Recipe page for ${userName} on Preserved Recipes` : 'Recipe page on Preserved Recipes',
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    try {
        await connectDB();

        const userDoc = await User.findOne({ email: session.user.email }).lean();

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        if (user.email !== session.user?.email) {
            redirect("/");
        }

        // Fetch recipes if user has any
        const recipeIdSet = new Set<string>();
        let allMixedRecipes: IRecipe[] = [];

        if (user.recipeIDs && user.recipeIDs.length > 0) {
            const recipeDocs = await Recipe.find({
                _id: { $in: user.recipeIDs.map(id => new ObjectId(id)) }
            }).lean();

            recipeDocs.forEach(doc => {
                const recipe = serializeDoc<IRecipe>(doc);
                recipeIdSet.add(recipe._id);
                allMixedRecipes.push(recipe);
            });
        }

        if (user.favoriteRecipeIDs && user.favoriteRecipeIDs.length > 0) {
            const favoriteRecipeDocs = await Recipe.find({
                _id: { $in: user.favoriteRecipeIDs.map(id => new ObjectId(id)) }
            }).lean();

            favoriteRecipeDocs.forEach(doc => {
                const recipe = serializeDoc<IRecipe>(doc);
                if (!recipeIdSet.has(recipe._id)) {
                    allMixedRecipes.push(recipe);
                }
            });
        }

        if (user.savedRecipeIDs && user.savedRecipeIDs.length > 0) {
            const savedRecipeDocs = await Recipe.find({
                _id: { $in: user.savedRecipeIDs.map(id => new ObjectId(id)) }
            }).lean();

            savedRecipeDocs.forEach(doc => {
                const recipe = serializeDoc<IRecipe>(doc);
                if (!recipeIdSet.has(recipe._id)) {
                    allMixedRecipes.push(recipe);
                }
            });
        }

        const ingredientDocs = await Ingredient.find({}).lean();
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
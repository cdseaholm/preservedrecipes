
import FamilyRecipes from "../components/recipes/family-recipes";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { getRecipesByIds, getAllIngredients } from "@/lib/data/recipes";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type FamilyRecipesPageParams = { params: Promise<{ famid: string }> };

export async function generateMetadata({ params }: FamilyRecipesPageParams): Promise<Metadata> {
    const { famid } = await params;
    const { family } = await getValidatedFamilyAccess(famid);

    return createPageMetadata({
        title: `${family.name} Recipes`,
        description: `Browse and manage recipes shared with the ${family.name} family space on Preserved Recipes.`,
        robots: { index: false, follow: true },
    });
}

export default async function Page({ params }: FamilyRecipesPageParams) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);

    const [userRecipes, familyRecipes, ingredients] = await Promise.all([
        getRecipesByIds(user.recipeIDs ?? []),
        getRecipesByIds(family.recipeIDs ?? []),
        getAllIngredients(),
    ]);

    return <FamilyRecipes userInfo={user} family={family} ingredients={ingredients} familyRecipes={familyRecipes} userRecipes={userRecipes} />
}

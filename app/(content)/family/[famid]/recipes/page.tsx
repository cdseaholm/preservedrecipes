
import FamilyRecipes from "../components/recipes/family-recipes";
import { getValidatedFamilyAccess } from "@/lib/data/family";
import { getRecipesByIds, getAllIngredients } from "@/lib/data/recipes";

export default async function Page({ params }: { params: Promise<{ famid: string }> }) {
    const { famid } = await params;
    const { user, family } = await getValidatedFamilyAccess(famid);

    const [userRecipes, familyRecipes, ingredients] = await Promise.all([
        getRecipesByIds(user.recipeIDs ?? []),
        getRecipesByIds(family.recipeIDs ?? []),
        getAllIngredients(),
    ]);

    return <FamilyRecipes userInfo={user} family={family} ingredients={ingredients} familyRecipes={familyRecipes} userRecipes={userRecipes} />
}
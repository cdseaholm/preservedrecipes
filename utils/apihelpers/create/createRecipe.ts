import { IRecipe } from "@/models/types/recipe";
import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/user";
import { RecipeFormType } from "@/components/forms/recipe/recipeForm";
import { useFamilyStore } from "@/context/familyStore";
import { IFamily } from "@/models/types/family";


export async function AttemptCreateRecipe({ recipeToAdd }: { recipeToAdd: RecipeFormType }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    try {
        const res = await fetch(`${urlToUse}/api/recipe/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipePassed: recipeToAdd })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        const userRecs = useUserStore.getState().userRecipes as IRecipe[];
        useUserStore.getState().setUserRecipes([...userRecs, data.recipeReturned]);
        const userInfo = useUserStore.getState().userInfo;

        const newRecipeIDs = [
            ...userInfo.recipeIDs,
            data.recipeReturned._id.toString()
        ] as string[];
        const newUserInfo = {
            ...userInfo,
            recipeIDs: newRecipeIDs,
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);
        if (recipeToAdd.familyRecipe === true) {
            const fam = useFamilyStore.getState().family;
            const oldFamRecipes = fam.recipes;
            const newFamRecipes = [...oldFamRecipes, data.recipeReturned];
            const newFam = {
                ...fam,
                recipes: newFamRecipes
            } as IFamily;
            useFamilyStore.getState().setFamily(newFam)
        }

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}
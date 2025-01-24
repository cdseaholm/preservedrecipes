import { IRecipe } from "@/models/types/recipe";
import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/user";
import { RecipeFormType } from "@/components/forms/recipe/recipeForm";


export async function AttemptCreateRecipe({ recipeToAdd }: { recipeToAdd: RecipeFormType }) {

    const urlToUse = process.env.BASE_URL ? process.env.BASE_URL as string : '';

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

        return { status: true, message: `Created` };

    } catch (error: any) {
        console.log('Creating Recipe error: ', error);
        return { status: false, message: `Failed creation` };
    }
}
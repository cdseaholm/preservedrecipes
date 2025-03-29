import { IRecipe } from "@/models/types/recipe";
import { useUserStore } from "@/context/userStore";
import { IUser } from "@/models/types/user";


export async function AttemptEditRecipe({ recipeToEdit }: { recipeToEdit: IRecipe }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    try {
        const res = await fetch(`${urlToUse}/api/recipe/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipePassed: recipeToEdit })
        });

        if (!res.ok) {
            return { status: false, message: `Failed editing, ${res.statusText}` };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed editing, Invalid JSON response` };
        }

        const userRecs = useUserStore.getState().userRecipes as IRecipe[];
        const updatedRecs = userRecs.map((rec) => rec._id === recipeToEdit._id ? data.recipeReturned : rec);
        useUserStore.getState().setUserRecipes(updatedRecs);

        const userInfo = useUserStore.getState().userInfo;
        const newUserInfo = {
            ...userInfo,
            recipeIDs: userInfo.recipeIDs.map((id) => id === recipeToEdit._id ? data.recipeReturned._id.toString() : id),
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);

        return { status: true, message: `Edited` };

    } catch (error: any) {
        return { status: false, message: `Failed editing` };
    }
}
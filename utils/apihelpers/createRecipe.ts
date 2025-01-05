import { IRecipe } from "@/models/types/recipe";
import { RecipeCreation } from "@/models/types/recipeCreation";


export async function AttemptCreateRecipe({ recipeToAdd }: { recipeToAdd: RecipeCreation }) {

    try {
        const res = await fetch(`/api/recipe/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipePassed: recipeToAdd })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}`, newRecipe: {} as IRecipe };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response`, newRecipe: {} as IRecipe };
        }

        return { status: true, message: `Created`, newRecipe: data.recipeReturned };

    } catch (error: any) {
        console.log('Creating Recipe error: ', error);
        return { status: false, message: `Failed creation`, newRecipe: {} as IRecipe };
    }
}
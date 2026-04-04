import { useDataStore } from "@/context/dataStore";
import { IIngredient } from "@/models/types/recipes/ingredient";

export async function AttemptCreateIngredients({ ingredients }: { ingredients: IIngredient[] }): Promise<{ status: boolean, message: string, createdIngredients?: IIngredient[] }> {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (ingredients.length <= 0) {
        return { status: true, message: `No new ingredients to create`, createdIngredients: [] as IIngredient[] };
    }

    if (!urlToUse || urlToUse === '') {
        return { status: false, message: `Invalid URL`, createdIngredients: [] as IIngredient[]  };
    }

    try {
        const res = await fetch(`${urlToUse}/api/ingredient/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newIngredients: ingredients })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}`, createdIngredients: [] as IIngredient[]  };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response`, createdIngredients: [] as IIngredient[]  };
        }

        if (data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data.message || 'Unknown error'}`, createdIngredients: [] as IIngredient[]  };
        }

        const createdIngs = data.ingredientsReturned as IIngredient[];
        if (!createdIngs || createdIngs.length <= 0) {
            return { status: false, message: `Failed Creation, No ingredients created`, createdIngredients: [] as IIngredient[]  };
        }

        const madeIngs = useDataStore.getState().ingredientNames as IIngredient[];
        useDataStore.getState().setIngredientNames([...madeIngs, ...createdIngs]);

        return { 
            status: true, 
            message: `Created`,
            createdIngredients: createdIngs
        };

    } catch (error: any) {
        return { status: false, message: `Failed creation`, createdIngredients: [] as IIngredient[]  };
    }
}
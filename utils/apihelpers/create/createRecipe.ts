import { useCommunityStore } from "@/context/communityStore";
import { useDataStore } from "@/context/dataStore";
import { useFamilyStore } from "@/context/familyStore";
import { useModalStore } from "@/context/modalStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IRecipe } from "@/models/types/recipes/recipe";



export async function AttemptCreateRecipe({ recipeToAdd, type, typeId }: { recipeToAdd: IRecipe, type: 'personal' | 'family' | 'community' | 'post', typeId: string }): Promise<{ status: boolean, message: string }> {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!recipeToAdd) {
        console.log('No recipe to add');
        return { status: false, message: `No recipe to add` };
    }

    if (!type) {
        console.log('No type specified');
        return { status: false, message: `No type specified` };
    }

    if ((type === 'family' || type === 'community') && (!typeId || typeId === '')) {
        console.log('No typeId specified for family/community recipe');
        return { status: false, message: `No typeId specified` };
    }

    if (!urlToUse || urlToUse === '') {
        console.log('No URL to use for recipe creation');
        return { status: false, message: `No URL to use` };
    }

    try {
        const res = await fetch(`${urlToUse}/api/recipe/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipePassed: recipeToAdd, type: type, typeId: typeId })
        });

        if (!res.ok) {
            console.log('Response not ok:', res.statusText);
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json();

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        if (data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data.message}` };
        }

        const returnedRecipe = data.recipeReturned as IRecipe;

        if (!returnedRecipe) {
            return { status: false, message: `Failed Creation, No recipe returned` };
        }

        const returnedIngredients = data.returnedIngredients as IIngredient[];

        if (!returnedIngredients) {
            return { status: false, message: `Failed Creation, No ingredients returned` };
        }

        useDataStore.getState().setIngredientNames(returnedIngredients);

        const userRecs = useUserStore.getState().userRecipes as IRecipe[];
        useUserStore.getState().setUserRecipes([...userRecs, returnedRecipe]);
        const userInfo = useUserStore.getState().userInfo;

        const newRecipeIDs = [
            ...userInfo.recipeIDs,
            returnedRecipe._id.toString()
        ] as string[];
        const newUserInfo = {
            ...userInfo,
            recipeIDs: newRecipeIDs,
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);
        if (type === 'family') {
            const fam = useFamilyStore.getState().family;
            const oldFamRecipeIDs = fam.recipeIDs;
            const newFamRecipeIDs = [...oldFamRecipeIDs, returnedRecipe._id.toString()];
            const newFam = {
                ...fam,
                recipeIDs: newFamRecipeIDs
            } as IFamily;
            useFamilyStore.getState().setFamily(newFam);
            const prevRecipes = useFamilyStore.getState().familyRecipes;
            const newFamRecipes = [...prevRecipes, returnedRecipe];
            useFamilyStore.getState().setFamilyRecipes(newFamRecipes);
        } else if (type === 'community') {
            const communityRecipes = useCommunityStore.getState().communityRecipes;
            useCommunityStore.getState().setCommunityRecipes([...communityRecipes, returnedRecipe]);
        }

        const backupPost = useDataStore.getState().recipeForPostAndPostBackup;

        if (type === 'post' && backupPost && backupPost.backupPost) {
            useDataStore.getState().setRecipeForPostAndPostBackup({ recipe: returnedRecipe, backupPost: backupPost.backupPost });
            useModalStore.getState().setOpenPostModal(backupPost.backupPost);
        }

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}
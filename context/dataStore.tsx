


import { ICommunity } from '@/models/types/community/community';
import { IPost } from '@/models/types/misc/post';
import { IIngredient } from '@/models/types/recipes/ingredient';
import { IRecipe } from '@/models/types/recipes/recipe';
import { create } from 'zustand';

interface DataStore {

    ingredientNames: IIngredient[];
    setIngredientNames: (ingredientNames: IIngredient[]) => void;
    communities: ICommunity[];
    setCommunities: (communitiesArray: ICommunity[]) => void;
    recipeForPostAndPostBackup: {recipe: IRecipe | null, backupPost: IPost | null} | null;
    setRecipeForPostAndPostBackup: (data: {recipe: IRecipe | null, backupPost: IPost | null} | null) => void;

}

export const useDataStore = create<DataStore>((set) => ({

    ingredientNames: [] as IIngredient[],
    setIngredientNames: (ingredientsArray) => set({ ingredientNames: ingredientsArray }),
    communities: [] as ICommunity[],
    setCommunities: (communitiesArray) => set({ communities: communitiesArray }),
    recipeForPostAndPostBackup: null,
    setRecipeForPostAndPostBackup: (data) => set({ recipeForPostAndPostBackup: data }),

}));
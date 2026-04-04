
import { IFamily } from '@/models/types/family/family';
import { IInvite } from '@/models/types/misc/invite';
import { IRecipe } from '@/models/types/recipes/recipe';
import { create } from 'zustand';

interface FamilyStore {
    family: IFamily;
    setFamily: (family: IFamily) => void;
    familyRecipes: IRecipe[];
    setFamilyRecipes: (recipes: IRecipe[]) => void;
    invite: IInvite | null;
    setInvite: (token: IInvite | null) => void;
}

export const useFamilyStore = create<FamilyStore>((set) => ({
    family: {} as IFamily,
    setFamily: (fam) => set({ family: fam }),
    familyRecipes: [] as IRecipe[],
    setFamilyRecipes: (recipes) => set({ familyRecipes: recipes }),
    invite: null,
    setInvite: (token) => set({ invite: token })
}));
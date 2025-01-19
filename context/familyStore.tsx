
import { IFamily } from '@/models/types/family';
import { FamilyMember } from '@/models/types/familyMemberRelation';
import { IRecipe } from '@/models/types/recipe';
import { create } from 'zustand';

interface FamilyStore {
    family: IFamily;
    setFamily: (family: IFamily) => void;
    familyRecipes: IRecipe[];
    setFamilyRecipes: (familyRecipes: IRecipe[]) => void;
    familyMembers: FamilyMember[];
    setFamilyMembers: (familyMembers: FamilyMember[]) => void;
}

export const useFamilyStore = create<FamilyStore>((set) => ({
    family: {} as IFamily,
    setFamily: (fam) => set({ family: fam }),
    familyRecipes: [] as IRecipe[],
    setFamilyRecipes: (recipes) => set({ familyRecipes: recipes }),
    familyMembers: [] as FamilyMember[],
    setFamilyMembers: (members) => ({ familyMembers: members })
}));

import { IFamily } from '@/models/types/family';
import { create } from 'zustand';

interface FamilyStore {
    family: IFamily;
    setFamily: (family: IFamily) => void;
}

export const useFamilyStore = create<FamilyStore>((set) => ({
    family: {} as IFamily,
    setFamily: (fam) => set({ family: fam }),
}));
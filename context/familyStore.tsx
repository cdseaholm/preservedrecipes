
import { IFamily } from '@/models/types/family';
import { IInvite } from '@/models/types/invite';
import { create } from 'zustand';

interface FamilyStore {
    family: IFamily;
    setFamily: (family: IFamily) => void;
    invite: IInvite | null;
    setInvite: (token: IInvite | null) => void;
}

export const useFamilyStore = create<FamilyStore>((set) => ({
    family: {} as IFamily,
    setFamily: (fam) => set({ family: fam }),
    invite: null,
    setInvite: (token) => set({ invite: token })
}));
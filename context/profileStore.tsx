
import { create } from 'zustand';

interface ProfileStore {
    tab: string;
    setTab: (tab: string) => void;
    profileInit: boolean;
    setProfileInit: (profileInit: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    tab: 'account',
    setTab: (t) => set({ tab: t }),
    profileInit: false,
    setProfileInit: (bool) => set({ profileInit: bool })
}));
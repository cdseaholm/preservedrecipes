
import { ProfilePageType } from '@/app/(content)/profile/components/mainProfile';
import { create } from 'zustand';

interface ProfileStore {
    tab: ProfilePageType;
    setTab: (tab: ProfilePageType) => void;
    profileInit: boolean;
    setProfileInit: (profileInit: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    tab: { child: 0, parent: 0 },
    setTab: (t) => set({ tab: t }),
    profileInit: false,
    setProfileInit: (bool) => set({ profileInit: bool })
}));
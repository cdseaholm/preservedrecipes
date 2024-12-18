
import { IUser } from '@/models/types/user';
import { create } from 'zustand';

interface UserStore {
    userInfo: IUser
    setUserInfo: (userInfo: IUser) => void
}

export const useUserStore = create<UserStore>((set) => ({
    userInfo: {} as IUser,
    setUserInfo: (info) => set({ userInfo: info })
}));
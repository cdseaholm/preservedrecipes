
import { ICommunity } from '@/models/types/community';
import { IRecipe } from '@/models/types/recipe';
import { IUser } from '@/models/types/user';
import { create } from 'zustand';

interface UserStore {
    userInfo: IUser;
    setUserInfo: (userInfo: IUser) => void;
    userRecipes: IRecipe[];
    setUserRecipes: (userRecipes: IRecipe[]) => void;
    userCommunities: ICommunity[];
    setUserCommunities: (userCommunities: ICommunity[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userInfo: {} as IUser,
    setUserInfo: (info) => set({ userInfo: info }),
    userRecipes: [] as IRecipe[],
    setUserRecipes: (recipes) => set({ userRecipes: recipes }),
    userCommunities: [] as ICommunity[],
    setUserCommunities: (communities) => set({ userCommunities: communities })
}));
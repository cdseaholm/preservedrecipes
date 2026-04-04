
import { ICommunity } from '@/models/types/community/community';
import { IInquiry } from '@/models/types/misc/inquiry';
import { IUser } from '@/models/types/personal/user';
import { IRecipe } from '@/models/types/recipes/recipe';
import { create } from 'zustand';

interface UserStore {
    userInfo: IUser;
    setUserInfo: (userInfo: IUser) => void;
    userRecipes: IRecipe[];
    setUserRecipes: (userRecipes: IRecipe[]) => void;
    userCommunities: ICommunity[];
    setUserCommunities: (userCommunities: ICommunity[]) => void;
    inquiries: IInquiry[];
    setInquiries: (inquiries: IInquiry[]) => void;

}

export const useUserStore = create<UserStore>((set) => ({
    userInfo: {} as IUser,
    setUserInfo: (info) => set({ userInfo: info }),
    userRecipes: [] as IRecipe[],
    setUserRecipes: (recipes) => set({ userRecipes: recipes }),
    userCommunities: [] as ICommunity[],
    setUserCommunities: (communities) => set({ userCommunities: communities }),
    inquiries: [] as IInquiry[],
    setInquiries: (inquiries) => set({ inquiries: inquiries })
}));
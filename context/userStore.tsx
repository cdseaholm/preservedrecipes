
import { ICommunity } from '@/models/types/community';
import { FamilyMember } from '@/models/types/familyMemberRelation';
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
    userFamilyRelations: FamilyMember[];
    setUserFamilyRelations: (userFamilyRelations: FamilyMember[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userInfo: {
        name: '',
        email: '',
        password: '',
        _id: '',
        userFamily: {
            familyID: '',
            siblingIDs: [] as string[],
            parentIDs: [] as string[],
            childrenIDs: [] as string[],
            partnerIDs: [] as string[]
        },
        recipeIDs: [] as string[],
        communityIDs: [] as string[],
        ratings: [] as number[],
        createdAt: '',
        updatedAt: '',
        resetPasswordToken: '',
        resetPasswordExpires: ''
    } as IUser,
    setUserInfo: (info) => set({ userInfo: info }),
    userRecipes: [] as IRecipe[],
    setUserRecipes: (recipes) => set({ userRecipes: recipes }),
    userCommunities: [] as ICommunity[],
    setUserCommunities: (communities) => set({ userCommunities: communities }),
    userFamilyRelations: [] as FamilyMember[],
    setUserFamilyRelations: (relations) => set({ userFamilyRelations: relations }),
}));
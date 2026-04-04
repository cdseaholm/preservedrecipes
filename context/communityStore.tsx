import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { create } from "zustand/react";

interface CommunityStore {
    community: ICommunity;
    setCommunity: (community: ICommunity) => void;
    admins: IUser[] | null;
    setAdmins: (admins: IUser[] | null) => void;
    creator: IUser | null;
    setCreator: (creator: IUser | null) => void;
    communityMembers: IUser[] | null;
    setCommunityMembers: (communityMembers: IUser[] | null) => void;
    communityPosts: IPost[];
    setCommunityPosts: (communityPosts: IPost[]) => void;
    communityRecipes: IRecipe[];
    setCommunityRecipes: (communityRecipes: IRecipe[]) => void;
    editCommunity: string | null;
    setEditCommunity: (editCommunity: string | null) => void;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
    community: {} as ICommunity,
    setCommunity: (comm) => set({ community: comm }),
    admins: null,
    setAdmins: (admins) => set({ admins: admins }),
    creator: null,
    setCreator: (creator) => set({ creator: creator }),
    communityMembers: null,
    setCommunityMembers: (communityMembers) => set({ communityMembers: communityMembers }),
    communityPosts: [] as IPost[],
    setCommunityPosts: (communityPosts) => set({ communityPosts: communityPosts }),
    communityRecipes: [] as IRecipe[],
    setCommunityRecipes: (communityRecipes) => set({ communityRecipes: communityRecipes }),
    editCommunity: null,
    setEditCommunity: (editCommunity) => set({ editCommunity: editCommunity }),
}));
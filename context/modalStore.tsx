import { ICommunity } from "@/models/types/community/community";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IPost } from "@/models/types/misc/post";
import { IRecipe } from "@/models/types/recipes/recipe";
import { create } from "zustand";


interface ModalStore {
    openSignInModal: boolean;
    setOpenSignInModal: (openSignInModal: boolean) => void;
    openSignOutModal: boolean;
    setOpenSignOutModal: (openSignOutModal: boolean) => void;
    openCreateFamilyModal: boolean;
    setOpenCreateFamilyModal: (openCreateFamilyModal: boolean) => void;
    openLoadingModal: boolean;
    setOpenLoadingModal: (openLoadingModal: boolean) => void;
    openInquiryModal: boolean;
    setOpenInquiryModal: (openInquiryModal: boolean) => void;
    openAddFamMemsModal: boolean;
    setOpenAddFamMemsModal: (openAddFamMemsModal: boolean) => void;
    openInviteSignInModal: boolean;
    setOpenInviteSignInModal: (openInviteSignInModal: boolean) => void;
    setOpenNameChangedModal: (openNameChangedModal: boolean) => void;
    openNameChangedModal: boolean;
    setOpenEmailChangedModal: (openEmailChangedModal: boolean) => void;
    openEmailChangedModal: boolean;
    setOpenPasswordChangedModal: (openPasswordChangedModal: boolean) => void;
    openPasswordChangedModal: boolean;
    openCreateCommunityModal: boolean;
    setOpenCreateCommunityModal: (openCreateCommunityModal: boolean) => void;
    openCreatePostModal: boolean;
    setOpenCreatePostModal: (openCreatePostModal: boolean) => void;
    requestToJoinCommunity: { community: ICommunity, type: 'restricted' | 'passwordProtected' } | null;
    setRequestToJoinCommunity: (requestToJoinCommunity: { community: ICommunity, type: 'restricted' | 'passwordProtected' } | null) => void;
    openRecipeForm: { type: 'create' | 'edit' | 'view' | '', recipe: IRecipe | null, from: 'personal' | 'family' | 'community' | 'post' | null, fromId: string | null };
    setOpenRecipeForm: (openRecipeForm: { type: 'create' | 'edit' | 'view' | '', recipe: IRecipe | null, from: 'personal' | 'family' | 'community' | 'post' | null, fromId: string | null }) => void;
    openPostModal: IPost | null;
    setOpenPostModal: (post: IPost | null) => void;
    //spec
    viewSpecificInquiry: IInquiry | null;
    setViewSpecificInquiry: (inquiry: IInquiry | null) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    openSignInModal: false,
    setOpenSignInModal: (open) => set({ openSignInModal: open }),
    openSignOutModal: false,
    setOpenSignOutModal: (open) => set({ openSignOutModal: open }),
    openCreateFamilyModal: false,
    setOpenCreateFamilyModal: (open) => set({ openCreateFamilyModal: open }),
    openAddFamMemsModal: false,
    setOpenAddFamMemsModal: (open) => set({ openAddFamMemsModal: open }),
    openLoadingModal: false,
    setOpenLoadingModal: (open) => set({ openLoadingModal: open }),
    openInquiryModal: false,
    setOpenInquiryModal: (open) => set({ openInquiryModal: open }),
    openInviteSignInModal: false,
    setOpenInviteSignInModal: (open) => set({ openInviteSignInModal: open }),
    openNameChangedModal: false,
    setOpenNameChangedModal: (open) => set({ openNameChangedModal: open }),
    openEmailChangedModal: false,
    setOpenEmailChangedModal: (open) => set({ openEmailChangedModal: open }),
    openPasswordChangedModal: false,
    setOpenPasswordChangedModal: (open) => set({ openPasswordChangedModal: open }),
    viewSpecificInquiry: null,
    setViewSpecificInquiry: (suggestion) => set({ viewSpecificInquiry: suggestion }),
    openCreateCommunityModal: false,
    setOpenCreateCommunityModal: (open) => set({ openCreateCommunityModal: open }),
    openCreatePostModal: false,
    setOpenCreatePostModal: (open) => set({ openCreatePostModal: open }),
    requestToJoinCommunity: null,
    setRequestToJoinCommunity: (requestType) => set({ requestToJoinCommunity: requestType }),
    openRecipeForm: {type: '', recipe: null, from: null, fromId: null},
    setOpenRecipeForm: (open) => set({ openRecipeForm: open }),
    openPostModal: null,
    setOpenPostModal: (post) => set({ openPostModal: post }),
}));
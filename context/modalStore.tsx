import { create } from "zustand";


interface ModalStore {
    openSignInModal: boolean;
    setOpenSignInModal: (openSignInModal: boolean) => void;
    openSignOutModal: boolean;
    setOpenSignOutModal: (openSignOutModal: boolean) => void;
    openCreateRecipeModal: boolean;
    setOpenCreateRecipeModal: (openCreateRecipeModal: boolean) => void;
    openCreateFamilyModal: boolean;
    setOpenCreateFamilyModal: (openCreateFamilyModal: boolean) => void;
    openLoadingModal: boolean;
    setOpenLoadingModal: (openLoadingModal: boolean) => void;
    openSuggestionModal: boolean;
    setOpenSuggestionModal: (openSuggestionModal: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    openSignInModal: false,
    setOpenSignInModal: (open) => set({ openSignInModal: open }),
    openSignOutModal: false,
    setOpenSignOutModal: (open) => set({ openSignOutModal: open }),
    openCreateRecipeModal: false,
    setOpenCreateRecipeModal: (open) => set({ openCreateRecipeModal: open }),
    openCreateFamilyModal: false,
    setOpenCreateFamilyModal: (open) => set({ openCreateFamilyModal: open }),
    openLoadingModal: false,
    setOpenLoadingModal: (open) => set({ openLoadingModal: open }),
    openSuggestionModal: false,
    setOpenSuggestionModal: (open) => set({ openSuggestionModal: open })
}));
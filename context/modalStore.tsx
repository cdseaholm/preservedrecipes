import { create } from "zustand";


interface ModalStore {
    openSignInModal: boolean;
    setOpenSignInModal: (openSignInModal: boolean) => void;
    openSignOutModal: boolean;
    setOpenSignOutModal: (openSignOutModal: boolean) => void;
    openRegisterModal: boolean;
    setOpenRegisterModal: (openRegisterModal: boolean) => void;
    openCreateRecipeModal: boolean;
    setOpenCreateRecipeModal: (openCreateRecipeModal: boolean) => void;
    openCreateFamilyModal: boolean;
    setOpenCreateFamilyModal: (openCreateFamilyModal: boolean) => void;
    openLoadingModal: boolean;
    setOpenLoadingModal: (openLoadingModal: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    openSignInModal: false,
    setOpenSignInModal: (open) => set({ openSignInModal: open }),
    openSignOutModal: false,
    setOpenSignOutModal: (open) => set({ openSignOutModal: open }),
    openRegisterModal: false,
    setOpenRegisterModal: (open) => set({ openRegisterModal: open }),
    openCreateRecipeModal: false,
    setOpenCreateRecipeModal: (open) => set({ openCreateRecipeModal: open }),
    openCreateFamilyModal: false,
    setOpenCreateFamilyModal: (open) => set({ openCreateFamilyModal: open }),
    openLoadingModal: false,
    setOpenLoadingModal: (open) => set({ openLoadingModal: open })
}));
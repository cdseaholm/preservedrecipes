import { create } from "zustand";


interface ModalStore {
    openSignInModal: boolean;
    setOpenSignInModal: (openSignInModal: boolean) => void;
    openSignOutModal: boolean;
    setOpenSignOutModal: (openSignOutModal: boolean) => void;
    openRegisterModal: boolean;
    setOpenRegisterModal: (openRegisterModal: boolean) => void;
    openPreferencesModal: boolean
    setOpenPreferencesModal: (setOpenPreferencesModal: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    openSignInModal: false,
    setOpenSignInModal: (open) => set({openSignInModal: open}),
    openSignOutModal: false,
    setOpenSignOutModal: (open) => set({openSignOutModal: open}),
    openRegisterModal: false,
    setOpenRegisterModal: (open) => set({openRegisterModal: open}),
    openPreferencesModal: false,
    setOpenPreferencesModal: (open) => set({openPreferencesModal: open})
}));
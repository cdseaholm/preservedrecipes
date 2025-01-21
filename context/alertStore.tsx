import { create } from 'zustand';

interface AlertStore {
    alertModalOpen: boolean;
    setAlertModalOpen: (alertModalOpen: boolean) => void;
    alertMessage: string;
    setAlertMessage: (alertMessage: string) => void;
    alertConfirm: boolean;
    setAlertConfirm: (alertConfirm: boolean) => void;
    globalToast: string;
    setGlobalToast: (globalToast: string) => void
}

export const useAlertStore = create<AlertStore>((set) => ({
    alertModalOpen: false,
    setAlertModalOpen: (open) => set({ alertModalOpen: open }),
    alertMessage: '',
    setAlertMessage: (message) => set({alertMessage: message}),
    alertConfirm: false,
    setAlertConfirm: (confirm) => set({alertConfirm: confirm}),
    globalToast: '',
    setGlobalToast: (message) => set({globalToast: message})
}));
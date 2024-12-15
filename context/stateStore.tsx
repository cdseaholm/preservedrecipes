import { create } from 'zustand';

interface StateStore {
    urlToUse: string;
    setUrlToUse: (url: string) => void;
    widthQuery: number;
    setWidthQuery: (width: number) => void;
}

export const useStateStore = create<StateStore>((set) => ({
    urlToUse: '',
    setUrlToUse: (url) => set({ urlToUse: url }),
    widthQuery: 0,
    setWidthQuery: (width) => set({ widthQuery: width }),
}));
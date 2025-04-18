import ZoomOutMobile from '@/utils/userHelpers/zoomOutMobile';
import { create } from 'zustand';

interface StateStore {
    urlToUse: string;
    setUrlToUse: (url: string) => void;
    widthQuery: number;
    setWidthQuery: (width: number) => void;
    heightQuery: number;
    setHeightQuery: (height: number) => void;
    shortStack: boolean;
    setShortStack: (short: boolean) => void;
    handleZoomReset: (screenWidth: number, max: boolean) => void;
    loadingProgress: boolean;
    setLoadingProgress: (loadingProgress: boolean) => void;
}

export const useStateStore = create<StateStore>((set) => ({
    urlToUse: '',
    setUrlToUse: (url) => set({ urlToUse: url }),
    widthQuery: 0,
    setWidthQuery: (width) => set({ widthQuery: width }),
    heightQuery: 0,
    setHeightQuery: (height) => set({ heightQuery: height }),
    shortStack: false,
    setShortStack: (short) => set({ shortStack: short }),
    handleZoomReset: (width, m) => {
        ZoomOutMobile({ deviceWidth: width, max: m })
    },
    loadingProgress: false,
    setLoadingProgress: (loading) => set({ loadingProgress: loading }),
}));
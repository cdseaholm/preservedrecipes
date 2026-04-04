import ZoomOutMobile from '@/utils/userHelpers/zoomOutMobile';
import { create } from 'zustand';

interface StateStore {
    urlToUse: string;
    setUrlToUse: (url: string) => void;
    handleZoomReset: (screenWidth: number, max: boolean) => void;
    loadingProgress: boolean;
    setLoadingProgress: (loadingProgress: boolean) => void;
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
    isNavigating: boolean;
    setIsNavigating: (val: boolean) => void;
}

export const useStateStore = create<StateStore>((set) => {

    return {
        urlToUse: '',
        setUrlToUse: (url) => set({ urlToUse: url }),
        handleZoomReset: (width, m) => {
            ZoomOutMobile({ deviceWidth: width, preventZoom: m });
        },
        loadingProgress: false,
        setLoadingProgress: (loading) => set({ loadingProgress: loading }),
        globalLoading: false,
        setGlobalLoading: (loading) => set({ globalLoading: loading }),
        isNavigating: false,
        setIsNavigating: (val) => set({ isNavigating: val }),
    };
});
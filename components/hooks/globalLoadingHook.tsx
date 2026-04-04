'use client'

import { useStateStore } from "@/context/stateStore"

export function useGlobalLoadingHook() {
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);

    function handleGlobalLoadingHook(isLoading: boolean) {
        setGlobalLoading(isLoading);
    }

    return { handleGlobalLoadingHook };
}
// hooks/navigation/useNavigation.ts
'use client'

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useStateStore } from "@/context/stateStore";

export function useNavigation() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);

    const navigate = (href: string, onComplete?: () => void) => {
        setIsNavigating(true);
        setGlobalLoading(true);
        startTransition(() => {
            router.push(href);
        });
        onComplete?.(); // e.g. closeDrawer — runs immediately, not after nav
    };

    // Sync isPending → Zustand so global spinner can read it
    // useEffect because isPending is derived from React internals
    useEffect(() => {
        setIsNavigating(isPending);
        if (!isPending) setGlobalLoading(false);
    }, [isPending, setGlobalLoading, setIsNavigating]);

    return { navigate, isPending };
}

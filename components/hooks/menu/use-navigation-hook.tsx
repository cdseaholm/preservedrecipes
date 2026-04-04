// hooks/navigation/useNavigation.ts
'use client'

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useStateStore } from "@/context/stateStore";

export function useNavigation() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const setIsNavigating = useStateStore(state => state.setIsNavigating);

    const navigate = (href: string, onComplete?: () => void) => {
        setIsNavigating(true);
        startTransition(() => {
            router.push(href);
        });
        onComplete?.(); // e.g. closeDrawer — runs immediately, not after nav
    };

    // Sync isPending → Zustand so global spinner can read it
    // useEffect because isPending is derived from React internals
    useEffect(() => {
        setIsNavigating(isPending);
    }, [isPending, setIsNavigating]);

    return { navigate, isPending };
}
'use client'

import { useAlertStore } from "@/context/alertStore";
import { useStateStore } from "@/context/stateStore";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function StateWrapper({ children }: { children: React.ReactNode }) {

    const widthRef = useRef<number | null>(null);
    const heightRef = useRef<number | null>(null);
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setHeightQuery = useStateStore((state) => state.setHeightQuery);
    const setShortStack = useStateStore((state) => state.setShortStack);
    const globalToast = useAlertStore(state => state.globalToast);
    const setGlobalToast = useAlertStore(state => state.setGlobalToast);

    const initializeWidths = useCallback((newWidth: number, newHeight: number) => {
        setWidthQuery(newWidth);
        setHeightQuery(newHeight);
        let widthPerc = newWidth * 0.8;
        if (widthPerc > newHeight) {
            setShortStack(true);
        }
    }, [setWidthQuery, setHeightQuery, setShortStack]);

    const updateMedia = useCallback(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        if (!newWidth || !newHeight) {
            return;
        }
        widthRef.current = newWidth;
        heightRef.current = newHeight;

        let widthPerc = newWidth * 0.8;
        if (widthPerc > newHeight) {
            setShortStack(true);
        }

        setWidthQuery(newWidth);
        setHeightQuery(newHeight);
    }, [setWidthQuery, setHeightQuery, setShortStack]);

    useEffect(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        if (!newWidth || !newHeight) {
            return;
        }
        widthRef.current = newWidth;
        heightRef.current = newHeight;
        initializeWidths(newWidth, newHeight);

        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    }, [updateMedia, initializeWidths]);

    useEffect(() => {
        if (globalToast !== '') {
            toast.info(globalToast);
            setGlobalToast('');
        }
    }, [globalToast, setGlobalToast]);

    return (
        <main className="w-screen h-screen scrollbar-thin scrollbar-webkit fixed top-[75px]" style={{ overflowX: 'hidden', overflowY: 'auto', height: 'calc(100vh - 75px)' }}>
            {children}
        </main>
    )
}
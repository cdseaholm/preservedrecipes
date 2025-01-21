'use client'

import { useEffect, useCallback, useRef, useState } from "react";
import { useStateStore } from "@/context/stateStore";
import { getBaseUrl } from "@/utils/helpers/helpers";
import MainFooter from "../nav/footer";
import { useSession } from "next-auth/react";
import { InitializeUserData } from "@/utils/apihelpers/initUserData";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import ColorPickerMode from "@/components/misc/colorpicker/colorPickerMode";
import { useAlertStore } from "@/context/alertStore";
import { toast } from "sonner";

export default function PageWrapper({ children }: Readonly<{ children: React.ReactNode; }>) {

    const { data: session } = useSession();
    const widthRef = useRef<number | null>(null);
    const heightRef = useRef<number | null>(null);
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setHeightQuery = useStateStore((state) => state.setHeightQuery);
    const setShortStack = useStateStore((state) => state.setShortStack)
    const setUrlToUse = useStateStore((state) => state.setUrlToUse);
    const colorPickerMode = useStateStore(state => state.colorPickerMode);
    const globalToast = useAlertStore(state => state.globalToast);
    const setGlobalToast = useAlertStore(state => state.setGlobalToast);
    const [loading, setLoading] = useState<boolean>(true);

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

    const handleUrlToUse = useCallback((currentUrl: string) => {
        setUrlToUse(currentUrl);
    }, [setUrlToUse]);

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
        const fetchUrl = async () => {
            try {
                const currentUrl = await getBaseUrl();
                if (currentUrl) {
                    handleUrlToUse(currentUrl);
                }
            } catch (error) {
                console.error("Failed to fetch base URL:", error);
            }
        };
        fetchUrl();
        const initUserData = async () => {
            if (!session) {
                setLoading(false);
                return;
            } else {
                const headers = { 'Authorization': `Bearer ${session.user}` };
                const initialized = await InitializeUserData(headers) as { status: boolean, message: string };

                if (!initialized || initialized.status === false) {
                    setLoading(false);
                    return;
                }

                setLoading(false);
            }
        };
        initUserData();
    }, [setUrlToUse, handleUrlToUse, session]);

    useEffect(() => {
        if (globalToast !== '') {
            toast.info(globalToast);
            setGlobalToast('');
        }
    }, [globalToast, setGlobalToast])

    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <LoadingSpinner screen={true} />
            </div>
        );
    }

    return (
        colorPickerMode ? (
            <ColorPickerMode />
        ) : (
            <main className="w-screen h-screen scrollbar-thin scrollbar-webkit fixed top-[75px]" style={{ overflowX: 'hidden', overflowY: 'auto', height: 'calc(100vh - 75px)' }}>
                {children}
                <MainFooter />
            </main>
        )
    )
}
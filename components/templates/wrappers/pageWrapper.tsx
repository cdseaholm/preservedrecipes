'use client'

import { useEffect, useCallback, useRef, useState } from "react";
import MainBody from "../mainBody";
import { useStateStore } from "@/context/stateStore";
import { getBaseUrl } from "@/utils/helpers/helpers";
import MainHeader from "../../nav/header";
import MainFooter from "../../nav/footer";
import MainTemplate from "../mainTemplate";
import ModalProvider from "../../providers/modalProvider";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { InitializeUserData } from "@/utils/userHelpers/initUserData";
import { useUserStore } from "@/context/userStore";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { IUser } from "@/models/types/user";

export default function PageWrapper({ children }: Readonly<{ children: React.ReactNode; }>) {

    const { data: session, update } = useSession();
    const widthRef = useRef<number | null>(null);
    const heightRef = useRef<number | null>(null);
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setHeightQuery = useStateStore((state) => state.setHeightQuery);
    const setShortStack = useStateStore((state) => state.setShortStack)
    const setUrlToUse = useStateStore((state) => state.setUrlToUse);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const [loading, setLoading] = useState<boolean>(true);

    const initializeWidths = useCallback((newWidth: number, newHeight: number) => {
        setWidthQuery(newWidth);
        setHeightQuery(newHeight);
        let widthPerc = newWidth * 0.8;
        if (widthPerc > newHeight) {
            setShortStack(true);
        }
    }, [setWidthQuery, setHeightQuery, setShortStack]);

    const handleUpdate = async () => {
        await update();
    };

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

    const handleUserInfo = useCallback(async (userInfo: IUser) => {
        setUserInfo(userInfo);
    }, [setUserInfo]);

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
                let user = session.user as User;
                const initialized = await InitializeUserData(user);

                if (!initialized || initialized.status === false) {
                    setLoading(false);
                    return;
                }

                await handleUserInfo(initialized.userInfo);
                setLoading(false);
            }
        };
        initUserData();
    }, [setUrlToUse, handleUrlToUse, handleUserInfo, session]);

    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <MainBody>
            <MainHeader session={session} loading={loading} />
            <MainTemplate>
                {children}
                <MainFooter />
            </MainTemplate>
            <ModalProvider handleUpdate={handleUpdate} session={session} />
        </MainBody>
    );
}
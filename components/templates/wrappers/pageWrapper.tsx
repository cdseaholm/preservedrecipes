'use client'

import { useEffect, useCallback, useState, useRef } from "react";
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
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setUrlToUse = useStateStore((state) => state.setUrlToUse);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const [loading, setLoading] = useState<boolean>(true)

    const initializeWidths = useCallback((newWidth: number) => {
        setWidthQuery(newWidth)
    }, [setWidthQuery]);

    const handleUpdate = async () => {
        await update();
    }

    const updateMedia = useCallback(() => {
        const newWidth = window.innerWidth;
        if (!newWidth) {
            return;
        }
        widthRef.current = newWidth
        setWidthQuery(newWidth);

    }, [setWidthQuery]);

    const handleUrlToUse = useCallback((currentUrl: string) => {
        setUrlToUse(currentUrl);
    }, [setUrlToUse]);

    const handleUserInfo = useCallback((userInfo: IUser) => {
        setUserInfo(userInfo)
    }, [setUserInfo]);

    useEffect(() => {
        const newWidth = window.innerWidth;
        if (!newWidth) {
            return;
        }
        widthRef.current = newWidth
        initializeWidths(newWidth);

        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    }, [updateMedia, initializeWidths]);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const currentUrl = await getBaseUrl();
                if (currentUrl) {
                    handleUrlToUse(currentUrl)
                }
            } catch (error) {
                console.error("Failed to fetch base URL:", error);
            }
        };
        fetchUrl();
        const initUserData = async () => {
            if (!session) {
                return;
            } else {
                let user = session.user as User;
                const initialized = await InitializeUserData(user);

                if (!initialized || initialized.status === false) {
                    return;
                }

                //set recipes, set family tree, etc
                handleUserInfo(initialized.userInfo)

            }
        }
        initUserData();
        setLoading(false)
    }, [setUrlToUse, handleUrlToUse, handleUserInfo, session]);

    return (
        loading ? (
            <LoadingSpinner />
        ) : (
            <MainBody>
                <MainHeader />
                <MainTemplate>
                    {children}
                    <MainFooter />
                </MainTemplate>
                <ModalProvider handleUpdate={handleUpdate} session={session} />
            </MainBody>
        )
    )
}
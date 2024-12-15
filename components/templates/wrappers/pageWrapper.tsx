'use client'

import { useEffect, useCallback } from "react";
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

export default function PageWrapper({ children }: Readonly<{ children: React.ReactNode; }>) {

    const { data: session, update } = useSession();
    let widthRef = 0 as number;
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setUrlToUse = useStateStore((state) => state.setUrlToUse);
    const setUserID = useUserStore(state => state.setUserID);

    const initializeWidths = () => {
        setWidthQuery(widthRef);
    }

    const handleUpdate = async () => {
        await update();
    }

    const updateMedia = useCallback(() => {
        const newWidth = window.innerWidth;
        if (newWidth !== widthRef) {
            widthRef = newWidth;
            setWidthQuery(newWidth);
        }
    }, [setWidthQuery]);

    useEffect(() => {
        const newWidth = window.innerWidth;
        if (!newWidth) {
            return;
        }
        widthRef = newWidth
        initializeWidths();

        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    }, [updateMedia]);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const currentUrl = await getBaseUrl();
                if (currentUrl) {
                    setUrlToUse(currentUrl);
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
                setUserID(initialized.userID)
                
            }
        }
        initUserData();
    }, [setUrlToUse]);

    return (
        <MainBody>
            <MainHeader />
            <MainTemplate>
                {children}
                <MainFooter />
            </MainTemplate>
            <ModalProvider handleUpdate={handleUpdate} session={session}/>
        </MainBody>
    )
}
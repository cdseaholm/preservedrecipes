'use client'

import { IUser } from "@/models/types/personal/user";
import AppHeader from "../nav/header/appHeader";
import { useUserStore } from "@/context/userStore";
import { useCallback, useEffect, useState } from "react";
import RouterTransitionWrapper from "./dynamicWrappers/routerTransitionWrapper";
import TextureWrapper from "./texture-wrapper";
import { ScrollArea } from "@mantine/core";
import MainFooter from "../nav/footer/footer";
import LoadingOverlayComponent from "../misc/loading/loading-overlay";
import { useStateStore } from "@/context/stateStore";

export default function NavWrapper({ children, userInfo }: { children: React.ReactNode, userInfo: IUser | null }) {
    const globalLoading = useStateStore(state => state.globalLoading)
    const currUserInfo = useUserStore(state => state.userInfo);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const [openMenu, setOpenMenu] = useState<'main' | 'sub' | null>(null);

    const handleMenuToggle = (menu: 'main' | 'sub' | null) => {
        if (openMenu !== menu) {
            setOpenMenu(menu);
        } else {
            setOpenMenu(null);
        }
    }

    const handleUser = useCallback(() => {
        if (userInfo && (!currUserInfo || currUserInfo.email !== userInfo.email)) {
            setUserInfo(userInfo);
        }
    }, [userInfo, setUserInfo, currUserInfo]);

    useEffect(() => {
        handleUser();
    }, [handleUser]);

    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-start overflow-hidden">
            <LoadingOverlayComponent visible={globalLoading} />
            <TextureWrapper>
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cardBack focus:px-4 focus:py-2 focus:text-mainText focus:shadow">
                    Skip to main content
                </a>
                <AppHeader handleMenuToggle={handleMenuToggle} openMenu={openMenu} userInfo={userInfo} />
                <main id="main-content" tabIndex={-1} className="box-border flex h-full min-h-0 w-full flex-col items-center justify-start bg-mainBack/35 pt-[60px]">
                    <ScrollArea w={'100%'} h={'100%'} scrollbarSize={8} className="z-3 min-h-0" p={0}>
                        <RouterTransitionWrapper />
                        {children}
                        <MainFooter />
                    </ScrollArea>
                </main>
            </TextureWrapper>
        </div>
    )
}

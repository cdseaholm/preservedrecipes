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
        <div className="flex flex-col justify-start items-center w-screen h-full overflow-hidden">
            <LoadingOverlayComponent visible={globalLoading} />
            <TextureWrapper>
                <AppHeader handleMenuToggle={handleMenuToggle} openMenu={openMenu} userInfo={userInfo} />
                <main className={`h-full w-full pt-[60px] flex flex-col justify-start items-center bg-mainBack/30`}>
                    <ScrollArea w={'100%'} scrollbarSize={10} className="z-3" p={0}>
                        <RouterTransitionWrapper />
                        {children}
                        <MainFooter />
                    </ScrollArea>
                </main>
            </TextureWrapper>
        </div>
    )
}
'use client'

import { IUser } from "@/models/types/personal/user";
import AppHeader from "../nav/header/appHeader";
import { useUserStore } from "@/context/userStore";
import { useEffect, useState } from "react";
import RouterTransitionWrapper from "./dynamicWrappers/routerTransitionWrapper";
import TextureWrapper from "./texture-wrapper";
import { ScrollArea } from "@mantine/core";
import MainFooter from "../nav/footer/footer";

export default function NavWrapper({ children, userInfo, loadingChild }: { children: React.ReactNode, userInfo: IUser | null, loadingChild: React.ReactNode | null }) {

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

    useEffect(() => {
        if (userInfo && (!currUserInfo || currUserInfo.email !== userInfo.email)) {
            setUserInfo(userInfo);
        }
    }, [userInfo, setUserInfo]);

    return (
        <div className="flex flex-col justify-start items-center w-screen h-full overflow-hidden">
            {loadingChild}
            <TextureWrapper>
                <AppHeader handleMenuToggle={handleMenuToggle} openMenu={openMenu} userInfo={userInfo} />
                <main className={`h-full w-full pt-[60px] flex flex-col justify-start items-center bg-mainBack/30`}>
                    <ScrollArea w={'100%'} scrollbarSize={10} className="z-3">
                        <RouterTransitionWrapper />
                        {children}
                        <MainFooter />
                    </ScrollArea>
                </main>
            </TextureWrapper>
        </div>
    )
}
'use client'

import { useProfileStore } from "@/context/profileStore";
import { IUser } from "@/models/types/user";
import { IUserFamily } from "@/models/types/userFamily";
import { Menu } from "@mantine/core";
import { useRouter } from "next/navigation";
import { JSX } from "react";



export default function MakeTexts({ userInfo, elements }: { userInfo: IUser, elements: JSX.Element[] }) {

    const recipesData = userInfo ? userInfo.recipeIDs as string[] : [] as string[];
    const userFamily = userInfo ? userInfo.userFamily as IUserFamily : {} as IUserFamily;
    const familyID = userFamily ? userFamily.familyID as string : '';
    const communitiesData = userInfo ? userInfo.communityIDs as string[] : [] as string[];
    const setTab = useProfileStore(s => s.setTab);
    const router = useRouter();
    const handleTab = async (tab: string) => {
        setTab(tab)
    }

    const handleNavigation = async (tab: string, href: string) => {
        await handleTab(tab);
        router.push(href);
    };


    const recipeText = recipesData && recipesData.length > 0 ? (
        <Menu.Item leftSection={elements[0]} onClick={() => handleNavigation('recipes', '/profile')}>
            {`Your Recipes`}
        </Menu.Item>
    ) : (
        <Menu.Item leftSection={elements[0]} onClick={() => handleNavigation('recipes', '/profile')}>
            {`Create a Recipe`}
        </Menu.Item>
    )

    const familyText = familyID && familyID !== '' ? (
        <Menu.Item leftSection={elements[1]} onClick={() => handleNavigation('family', '/profile')}>
            {`Your Family`}
        </Menu.Item >
    ) : (
        <Menu.Item leftSection={elements[1]} onClick={() => handleNavigation('family', '/profile')}>
            {`Create a family`}
        </Menu.Item>
    )

    const communityText = communitiesData && communitiesData.length > 0 ? (
        <Menu.Item leftSection={elements[2]} onClick={() => handleNavigation('communities', '/profile')}>
            {`Your Communities`}
        </Menu.Item >
    ) : (
        <Menu.Item leftSection={elements[2]} onClick={() => router.push('/community')}>
            {`Join a Community`}
        </Menu.Item>
    )

    return [recipeText, familyText, communityText] as JSX.Element[]
}
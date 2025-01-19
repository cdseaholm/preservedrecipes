'use client'

import { useEffect, useCallback, useRef, useState } from "react";
import { useStateStore } from "@/context/stateStore";
import { getBaseUrl } from "@/utils/helpers/helpers";
import MainFooter from "../nav/footer";
import { useSession } from "next-auth/react";
import { InitializeUserData } from "@/utils/userHelpers/initUserData";
import { useUserStore } from "@/context/userStore";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { IUser } from "@/models/types/user";
import ColorPickerMode from "@/components/misc/colorpicker/colorPickerMode";
import { IRecipe } from "@/models/types/recipe";
import { ICommunity } from "@/models/types/community";
import { FamilyMember } from "@/models/types/familyMemberRelation";
import { IFamily } from "@/models/types/family";
import { useFamilyStore } from "@/context/familyStore";

export default function PageWrapper({ children }: Readonly<{ children: React.ReactNode; }>) {

    const { data: session } = useSession();
    const widthRef = useRef<number | null>(null);
    const heightRef = useRef<number | null>(null);
    const setWidthQuery = useStateStore((state) => state.setWidthQuery);
    const setHeightQuery = useStateStore((state) => state.setHeightQuery);
    const setShortStack = useStateStore((state) => state.setShortStack)
    const setUrlToUse = useStateStore((state) => state.setUrlToUse);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const setUserRecipes = useUserStore(state => state.setUserRecipes);
    const setUserCommunities = useUserStore(state => state.setUserCommunities);
    const setFamily = useFamilyStore(state => state.setFamily);
    const setFamilyMembers = useFamilyStore(state => state.setFamilyMembers);
    const setFamilyRecipes = useFamilyStore(state => state.setFamilyRecipes);
    const colorPickerMode = useStateStore(state => state.colorPickerMode);
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

    const handleUserInfo = useCallback(async (initialized: {
        status: boolean;
        message: string;
        recipes: IRecipe[];
        communities: ICommunity[];
        members: FamilyMember[];
        familyRecipes: IRecipe[];
        family: IFamily;
        userInfo: IUser;
    }) => {
        setUserInfo(initialized.userInfo);
        setUserRecipes(initialized.recipes);
        setUserCommunities(initialized.communities);
        setFamily(initialized.family);
        setFamilyMembers(initialized.members);
        setFamilyRecipes(initialized.familyRecipes);
    }, [setUserInfo, setUserRecipes, setUserCommunities, setFamily, setFamilyMembers, setFamilyRecipes]);

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
                const initialized = await InitializeUserData(headers) as { status: boolean, message: string, recipes: IRecipe[], communities: ICommunity[], members: FamilyMember[], familyRecipes: IRecipe[], family: IFamily, userInfo: IUser };

                if (!initialized || initialized.status === false) {
                    setLoading(false);
                    return;
                }

                await handleUserInfo(initialized);
                setLoading(false);
            }
        };
        initUserData();
    }, [setUrlToUse, handleUrlToUse, handleUserInfo, session]);

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
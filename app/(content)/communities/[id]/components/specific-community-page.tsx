'use client'

import { IUser } from "@/models/types/personal/user";
import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IRequest } from "@/models/types/misc/request";
import { useEffect, useState } from "react";
import InCommunityTab from "./tabs/in-community-tab";
import { useCommunityStore } from "@/context/communityStore";
import UserSettingsTab from "./tabs/user-settings";
import CommunitySettings from "./tabs/community-settings";
import { useUserStore } from "@/context/userStore";
import { useSearchParams } from "next/navigation";
import { useStateStore } from "@/context/stateStore";

export default function SpecificCommunityPage({ userInfo, community, creator, admins, posts, recipes, userIsAdmin, userRecipes, members, requests }: { userInfo: IUser | null, community: ICommunity, creator: IUser | null, admins: IUser[] | null, posts: IPost[], recipes: IRecipe[], userIsAdmin: boolean, userRecipes: IRecipe[], members: IUser[] | null, requests: IRequest[] }) {

    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const searchParams = useSearchParams();
    
    // ✅ Read tab from URL query params
    const tabFromUrl = searchParams.get('tab') as 'posts' | 'members' | 'community-settings' | 'user-settings' | 'requests' | null;
    const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'community-settings' | 'user-settings' | 'requests'>(tabFromUrl || 'posts');

    const handleLoading = (state: boolean) => {
        setGlobalLoading(state);
    }
    const setCurrCommunity = useCommunityStore(state => state.setCommunity);
    const setLocalAdmins = useCommunityStore(state => state.setAdmins);
    const setLocalPosts = useCommunityStore(state => state.setCommunityPosts);
    const setLocalRecipes = useCommunityStore(state => state.setCommunityRecipes);
    const setLocalCreator = useCommunityStore(state => state.setCreator);
    
    // ✅ Subscribe to Zustand store - component re-renders when these change
    const localCreator = useCommunityStore(state => state.creator);
    const currCommunity = useCommunityStore(state => state.community);
    const localAdmins = useCommunityStore(state => state.admins);
    const localPosts = useCommunityStore(state => state.communityPosts);
    const localRecipes = useCommunityStore(state => state.communityRecipes);
    const setUserRecipes = useUserStore(state => state.setUserRecipes);

    console.log('Community posts in specific community page:', localPosts);

    // ✅ Update activeTab when URL changes
    useEffect(() => {
        if (tabFromUrl && ['posts', 'members', 'community-settings', 'user-settings', 'requests'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // const handleTab = (tab: 'posts' | 'members' | 'community-settings' | 'user-settings') => {
    //     setActiveTab(tab); // Update local state immediately
    //     window.history.pushState({}, '', `/communities/${community._id}?tab=${tab}`);
    // }

    useEffect(() => {
        // Hydrate Zustand with server-fetched data on mount
        if (community) setCurrCommunity(community);
        if (creator) setLocalCreator(creator);
        if (admins) setLocalAdmins(admins);
        if (posts) setLocalPosts(posts);
        if (recipes) setLocalRecipes(recipes);
        if (userRecipes) setUserRecipes(userRecipes);
    }, [community, creator, admins, posts, recipes, userRecipes, setCurrCommunity, setLocalCreator, setLocalAdmins, setLocalPosts, setLocalRecipes, setUserRecipes]);

    // ✅ Fallback to server data if Zustand is empty
    const displayPosts = localPosts.length > 0 ? localPosts : posts;
    const displayRecipes = localRecipes.length > 0 ? localRecipes : recipes;
    const displayAdmins = localAdmins && localAdmins.length > 0 ? localAdmins : admins;
    const displayCreator = localCreator || creator;
    const displayCommunity = currCommunity._id ? currCommunity : community;

    const tabRelatedItem = (
        activeTab === 'posts' ? <InCommunityTab tab="posts" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={members} userIsAdmin={userIsAdmin} requests={requests} /> :
        activeTab === 'members' ? <InCommunityTab tab="members" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={members} userIsAdmin={userIsAdmin} requests={requests} /> :
        activeTab === 'requests' ? <InCommunityTab tab="requests" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={members} userIsAdmin={userIsAdmin} requests={requests} /> :
        activeTab === 'community-settings' ? <CommunitySettings communityID={displayCommunity._id} handleLoading={handleLoading} /> :
        <UserSettingsTab isAdmin={userIsAdmin} community={displayCommunity} userInfo={userInfo} />
    )

    return (
        <NavWrapper userInfo={userInfo}>
            <div className="sticky top-0 z-20 flex w-full flex-wrap justify-center gap-2 bg-mainBack/95 px-3 py-2 shadow-sm">
                {(['posts', 'members', ...(userIsAdmin ? ['requests', 'community-settings'] as const : []), 'user-settings'] as const).map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => {
                            setActiveTab(tab);
                            window.history.pushState({}, '', `/communities/${displayCommunity._id}?tab=${tab}`);
                        }}
                        className={`rounded-md px-3 py-2 text-xs sm:text-sm ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-cardBack text-mainText hover:bg-blue-50'}`}
                    >
                        {tab === 'community-settings' ? 'Settings' : tab === 'user-settings' ? 'Membership' : tab}
                    </button>
                ))}
            </div>
            {tabRelatedItem}

        </NavWrapper>
    )
}

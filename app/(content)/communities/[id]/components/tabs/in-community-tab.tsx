'use client'

import BasicSort from "@/components/buttons/filter-and-sorts/basic-sort";
import { Pagination, Group } from "@mantine/core";
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import PostCard from "../post-card";
import { IPost } from "@/models/types/misc/post";
import { IRecipe } from "@/models/types/recipes/recipe";
import { toast } from "sonner";
import ListWrapper from "@/components/wrappers/list-wrapper";
import { IUser } from "@/models/types/personal/user";
import { ICommunity } from "@/models/types/community/community";
import { sortValueKey } from "@/components/buttons/filter-and-sorts/community-sort";
import { useWindowSizes } from "@/context/width-height-store";

export default function InCommunityTab({ tab, posts, recipes, admins, userInfo, community, creator, members }: { tab: 'posts' | 'members' | 'community-settings' | 'user-settings', posts: IPost[], recipes: IRecipe[], admins: IUser[] | null, creator: IUser | null, userInfo: IUser | null, community: ICommunity, members: IUser[] | null }) {
    console.log('Tab: ', tab);
    const [filter, setFilter] = useState<string>('added_desc');
    const [currentPage, setCurrentPage] = useState<number>(1);

    ////////////////////////////////////////
    //Just to clear recipes until I use it//
    const print = false;
    if (print) {
        console.log('Recipes: ', recipes);
    }
    ////////////////////////////////////////

    //const setOpenCreatePostModal = useModalStore(state => state.setOpenCreatePostModal);
    const { width, height } = useWindowSizes();
    const widthToUse = width <= 300 ? 'w-[300px]' : 'w-full';
    const heightToUse = height < 700 ? 'h-[500px]' : `h-[70dvh]`;
    const isMember = userInfo && community && community.communityMemberIDs ? (community.communityMemberIDs.includes(userInfo._id) || community.adminIDs.includes(userInfo._id) || community.creatorID === userInfo._id) : false;
    //
    // Keeping recipes around because may use it with posts
    //
    // const handleAction = (which?: 'members' | 'community') => {
    //     if (currTab === 'dashboard') {
    //         setOpenCreatePostModal(true);
    //     } else if (currTab === 'recipes') {
    //         // Handle create recipe modal open
    //     } else if (which && which === 'members') {
    //         redirect(`/communities/${community._id}/community-members`);
    //     } else if (which && which === 'community') {
    //         // Handle community create action
    //     } else {
    //         return;
    //     }
    // }

    const handleSort = (newSort: string | null) => {
        setFilter(newSort ? newSort : 'added_desc');
    }

    const toRender = (
        <div className={`flex flex-col justify-start items-center ${widthToUse} ${heightToUse} bg-mainBack/30 px-3 pb-4 pt-2 sm:px-5`}>

            {/**Maybe need to take sort out for certain tabs */}

            <div className={`flex flex-row justify-between items-end sm:space-x-4 w-full h-fit p-2`}>
                {/**Need to make a sort for this page, not sure if "filter" is correct for the BasicSort, it's been a while */}
                <BasicSort widthQuery={width} handleSort={handleSort} data={sortValueKey} defaultValue="name_asc" value={filter} />
                <h2 className="text-lg font-semibold text-start capitalize">{community && community.name ? (width > 640 ? 'Community: ' + community.name : community.name) : 'Community'}</h2>
            </div>
            {/**Need to update number of pages later */}
            <ListWrapper
                numberOfPages={Math.ceil(posts.length / 5)}
                isPending={false}
                currentPage={currentPage}
                searchBar={null} editButtons={undefined}            >
                <CardView data={tab === 'posts' ? posts : tab === 'members' ? members : { creator: creator, admins: admins }} filter={filter} currentPage={currentPage} currTab={tab} isMember={isMember} community={community} />
            </ListWrapper>
            {posts && posts.length > 1 ? (
                <div className="w-full flex justify-center mt-4">
                    <Pagination.Root total={Math.ceil(posts.length / 5)} value={currentPage} onChange={setCurrentPage}>
                        <Group gap={5} justify='center'>
                            <Pagination.First />
                            <Pagination.Previous />
                            <Pagination.Items />
                            <Pagination.Next />
                            <Pagination.Last />
                        </Group>
                    </Pagination.Root>
                </div>
            ) : (
                null
            )}
        </div>
    )

    return toRender;
}

const CardView = ({ data, filter, currentPage, currTab, isMember, community }: { data: IPost[] | IUser[] | { creator: IUser | null, admins: IUser[] | null } | null, filter: string, currentPage: number, currTab: 'posts' | 'members' | 'community-settings' | 'user-settings', isMember: boolean, community: ICommunity | null }) => {
    if (!community || !data) {
        return null;
    } else if (currTab === 'posts') {
        const posts = data as IPost[];
        return (
            posts && posts.length > 0 ? (
                posts.sort((a, b) => {
                    if (filter === 'added_desc') {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    } else if (filter === 'added_asc') {
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    } else {
                        return 0;
                    }
                }).slice((currentPage - 1) * 5, currentPage * 5).map((post, index) => (
                    <PostCard key={post._id} index={index} post={post} communityId={community._id} />
                ))
            ) : (
                <ul className="p-2 text-start pl-7">
                    {'Add a post to see it here'}
                </ul>
            )
        );
    } else if (currTab === 'members') {
        const members = data as IUser[];
        return (
            members && members.length > 0 ? (
                members.sort((a, b) => {
                    if (filter === 'added_desc') {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    } else if (filter === 'added_asc') {
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    } else {
                        return 0;
                    }
                }).map((member) => (
                    <UserCard key={member._id} user={member} />
                ))
            ) : (
                <ul className="p-2 text-start pl-7">
                    {'Add a member to see it here'}
                </ul>
            )
        );
    } else if (currTab === 'community-settings') {
        const admins = data as { creator: IUser | null, admins: IUser[] | null };
        return (
            <div>
                <h3 className="text-lg font-semibold">Admins</h3>
                {admins.admins && admins.admins.length > 0 ? (
                    <ul>
                        {admins.admins.map(admin => {
                            const currAdminIsCreator = admin._id === admins.creator?._id ? true : false;
                            return (
                                (
                                    <li key={admin._id}>{currAdminIsCreator && <span>(Creator)</span>}{admin.name}</li>
                                )
                            )
                        })}
                    </ul>
                ) : (
                    <p>No admins found.</p>
                )}
                {!isMember && community?.privacyLevel === 'public' ? (
                    <button type="button" className={`mt-4 h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-2 cursor-pointer`} aria-label="Join Community" title="Join Community" onClick={() => toast.info('Join Community feature coming soon!')}>
                        {<BiPlus size={20} />}
                        <p>Join Community</p>
                    </button>
                ) : !isMember && community?.privacyLevel === 'private' || community?.privacyLevel === 'restricted' || community?.privacyLevel === 'passwordProtected' ? (
                    <button type="button" className={`mt-4 h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-2 cursor-pointer`} aria-label="Request to Join Community" title="Request to Join Community" onClick={() => toast.info('Request to Join Community feature coming soon!')}>
                        {<BiPlus size={20} />}
                        <p>Request to Join Community</p>
                    </button>
                ) : (
                    <button type="button" className={`mt-4 h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-red-300 text-red-500 rounded-md text-sm sm:text-base space-x-2 cursor-pointer`} aria-label="Leave Community" title="Leave Community" onClick={() => toast.info('Leave Community feature coming soon!')}>
                        {<BiMinus size={20} />}
                        <p>Leave Community</p>
                    </button>
                )}
            </div>
        );
    } else if (currTab === 'user-settings') {
        const user = data as { creator: IUser | null, admins: IUser[] | null };
        return (
            <div>
                <h3 className="text-lg font-semibold">User Settings</h3>
                <p>Name: {user.creator?.name}</p>
                <p>Email: {user.creator?.email}</p>
                {/* Future implementation for user settings */}
            </div>
        );
    } else {
        return null;
    }
};

//need to privatize these later
const UserCard = ({ user }: { user: IUser }) => {
    return (
        <div className="border-b border-gray-200 py-4" key={user._id}>
            <h4 className="text-lg font-semibold">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.email}</p>
        </div>
    );
};

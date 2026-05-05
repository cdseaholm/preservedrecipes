'use client'

import BasicSort from "@/components/buttons/filter-and-sorts/basic-sort";
import ListWrapper from "@/components/wrappers/list-wrapper";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import { useModalStore } from "@/context/modalStore";
import { useWindowSizes } from "@/context/width-height-store";
import { ICommunity } from "@/models/types/community/community";
import { IRequest } from "@/models/types/misc/request";
import { IPost } from "@/models/types/misc/post";
import { IUser } from "@/models/types/personal/user";
import { IRecipe, RecipeFormContextType } from "@/models/types/recipes/recipe";
import { sortValueKey } from "@/components/buttons/filter-and-sorts/community-sort";
import { useMemo, useState } from "react";
import { BiBookAdd, BiCheck, BiMessageAdd, BiX } from "react-icons/bi";
import { toast } from "sonner";
import PostCard from "../post-card";

type TabName = 'posts' | 'members' | 'community-settings' | 'user-settings' | 'requests';

export default function InCommunityTab({
    tab,
    posts,
    recipes,
    userInfo,
    community,
    members,
    userIsAdmin,
    requests,
}: {
    tab: TabName,
    posts: IPost[],
    recipes: IRecipe[],
    admins: IUser[] | null,
    creator: IUser | null,
    userInfo: IUser | null,
    community: ICommunity,
    members: IUser[] | null,
    userIsAdmin: boolean,
    requests: IRequest[]
}) {
    const [filter, setFilter] = useState<string>('added_desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { width } = useWindowSizes();
    const setOpenPostModal = useModalStore(state => state.setOpenPostModal);
    const setOpenRecipeForm = useModalStore(state => state.setOpenRecipeForm);
    const itemsPerPage = 5;
    const recipeCount = recipes.length;
    const isMember = !!userInfo && (community.communityMemberIDs.includes(userInfo._id) || community.adminIDs.includes(userInfo._id) || community.creatorID === userInfo._id);

    const totalItems = tab === 'posts' ? posts.length : tab === 'members' ? (members?.length ?? 0) : tab === 'requests' ? requests.length : 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => filter === 'added_asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts, filter]);

    const openCreatePost = () => {
        if (!isMember) {
            toast.info('Join this community before posting');
            return;
        }
        setOpenPostModal({
            _id: '',
            name: '',
            type: null,
            image: '',
            creatorID: userInfo?._id || '',
            relatedToID: community._id,
            relatedToType: 'community',
            commentIDs: [],
            ratingIDs: [],
            category: [],
            content: [],
            createdAt: '',
            updatedAt: '',
        });
    };

    const openCreateRecipe = () => {
        if (!isMember) {
            toast.info('Join this community before adding recipes');
            return;
        }
        setOpenRecipeForm({
            type: 'create',
            recipe: null,
            from: 'community',
            fromId: community._id,
        } as RecipeFormContextType);
    };

    return (
        <ContentWrapper containedChild={false} paddingNeeded={true}>
            <section className="mx-auto flex min-h-[74dvh] w-full max-w-5xl flex-col gap-4 rounded-md bg-mainBack/30 p-3 sm:p-5">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-semibold text-mainText">{community.name}</h1>
                        <p className="mt-1 max-w-2xl text-sm text-mainText/70">{community.description || 'A recipe-focused community.'}</p>
                        <p className="mt-1 text-xs text-mainText/60">{recipeCount} shared recipes</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {community.tags.map(tag => <span key={tag} className="rounded-md bg-cardBack px-2 py-1 text-xs text-mainText/70">{tag}</span>)}
                        </div>
                    </div>
                    {tab === 'posts' && (
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={openCreatePost} className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">
                                <BiMessageAdd /> Post
                            </button>
                            <button type="button" onClick={openCreateRecipe} className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700">
                                <BiBookAdd /> Recipe
                            </button>
                        </div>
                    )}
                </header>

                <div className="flex flex-row justify-between items-end sm:space-x-4 w-full h-fit">
                    {tab !== 'requests' && <BasicSort widthQuery={width} handleSort={(newSort) => setFilter(newSort || 'added_desc')} data={sortValueKey} defaultValue="added_desc" value={filter} />}
                </div>

                <ListWrapper numberOfPages={totalPages} isPending={false} currentPage={currentPage} onPageChange={setCurrentPage} searchBar={null} editButtons={undefined}>
                    {tab === 'posts' && <PostList posts={sortedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} communityId={community._id} />}
                    {tab === 'members' && <MemberList members={(members || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} />}
                    {tab === 'requests' && <RequestList requests={requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} canManage={userIsAdmin} />}
                </ListWrapper>
            </section>
        </ContentWrapper>
    );
}

function PostList({ posts, communityId }: { posts: IPost[], communityId: string }) {
    if (posts.length === 0) return <p className="p-3 text-sm text-mainText/70">No posts yet. Share a recipe, ask a food question, or start a cooking discussion.</p>;
    return posts.map((post, index) => <PostCard key={post._id} index={index} post={post} communityId={communityId} />);
}

function MemberList({ members }: { members: IUser[] }) {
    if (members.length === 0) return <p className="p-3 text-sm text-mainText/70">No members found.</p>;
    return members.map(member => (
        <article key={member._id} className="mb-3 rounded-md border border-mainText/15 bg-cardBack p-3">
            <h3 className="font-semibold text-mainText">{member.name}</h3>
            <p className="text-sm text-mainText/65">{member.email}</p>
        </article>
    ));
}

function RequestList({ requests, canManage }: { requests: IRequest[], canManage: boolean }) {
    const [busyId, setBusyId] = useState<string | null>(null);

    const decide = async (requestID: string, action: 'approved' | 'rejected') => {
        setBusyId(requestID);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const response = await fetch(`${baseUrl}/api/community/request`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestID, action }),
            });
            const data = await response.json();
            if (!response.ok || data.status !== 200) {
                toast.error(data.message || 'Unable to update request');
                setBusyId(null);
                return;
            }
            toast.success(data.message);
            window.location.reload();
        } catch {
            toast.error('Unable to update request');
            setBusyId(null);
        }
    };

    if (requests.length === 0) return <p className="p-3 text-sm text-mainText/70">No pending admin messages.</p>;

    return requests.map(request => (
        <article key={request._id} className="mb-3 rounded-md border border-mainText/15 bg-cardBack p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="font-semibold text-mainText">{request.requesterName || 'Community request'}</h3>
                    <p className="text-sm text-mainText/65">{request.requesterEmail}</p>
                    <p className="mt-2 text-sm text-mainText/80">{request.message}</p>
                </div>
                {canManage && (
                    <div className="flex gap-2">
                        <button disabled={busyId === request._id} onClick={() => decide(request._id, 'approved')} className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50">
                            <BiCheck /> Approve
                        </button>
                        <button disabled={busyId === request._id} onClick={() => decide(request._id, 'rejected')} className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50">
                            <BiX /> Reject
                        </button>
                    </div>
                )}
            </div>
        </article>
    ));
}

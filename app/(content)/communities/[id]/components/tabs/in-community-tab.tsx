'use client'

import BasicSort from "@/components/buttons/filter-and-sorts/basic-sort";
import ListWrapper from "@/components/wrappers/list-wrapper";
import { useModalStore } from "@/context/modalStore";
import { useWindowSizes } from "@/context/width-height-store";
import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";
import { IRequest } from "@/models/types/misc/request";
import { IUser } from "@/models/types/personal/user";
import { IRecipe, RecipeFormContextType } from "@/models/types/recipes/recipe";
import { sortValueKey } from "@/components/buttons/filter-and-sorts/community-sort";
import { useMemo, useState } from "react";
import { BiBookAdd, BiCheck, BiMessageAdd, BiX } from "react-icons/bi";
import { toast } from "sonner";
import PostCard from "../post-card";
import {
    Badge,
    Button,
    Card,
    Group,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { IconBook2, IconClock, IconInbox, IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

type TabName = 'posts' | 'recipes' | 'members' | 'community-settings' | 'user-settings' | 'requests';

export default function InCommunityTab({
    tab,
    posts,
    recipes,
    admins,
    creator,
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
    const isMember = !!userInfo && (community.communityMemberIDs.includes(userInfo._id) || community.adminIDs.includes(userInfo._id) || community.creatorID === userInfo._id);

    const displayMembers = useMemo(() => {
        const memberMap = new Map<string, IUser>();
        [...(members || []), ...(admins || []), ...(creator ? [creator] : [])].forEach(member => {
            if (member?._id) memberMap.set(member._id, member);
        });
        return Array.from(memberMap.values());
    }, [admins, creator, members]);

    const totalItems = tab === 'posts'
        ? posts.length
        : tab === 'recipes'
            ? recipes.length
            : tab === 'members'
                ? displayMembers.length
                : tab === 'requests'
                    ? requests.length
                    : 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => filter === 'added_asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts, filter]);

    const sortedRecipes = useMemo(() => {
        return [...recipes].sort((a, b) => filter === 'added_asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [recipes, filter]);

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
        <Stack gap="md">
            <Group justify="space-between" align="flex-end" gap="sm">
                <div>
                    <Text fw={700}>
                        {tab === 'posts'
                            ? 'Community posts'
                            : tab === 'recipes'
                                ? 'Shared recipes'
                                : tab === 'members'
                                    ? 'Members'
                                    : 'Join requests'}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {tab === 'posts'
                            ? 'Share recipes, ask questions, and keep community conversations moving.'
                            : tab === 'recipes'
                                ? 'Browse recipes added directly to this community.'
                                : tab === 'members'
                                    ? 'People connected to this community, including admins and the creator.'
                                    : 'Review pending requests from people who want to join.'}
                    </Text>
                </div>

                {(tab === 'posts' || tab === 'recipes') && (
                    <Group gap="xs">
                        <Button type="button" onClick={openCreatePost} leftSection={<BiMessageAdd />} variant="filled">
                            Post
                        </Button>
                        <Button type="button" onClick={openCreateRecipe} leftSection={<BiBookAdd />} color="green" variant="light">
                            Recipe
                        </Button>
                    </Group>
                )}
            </Group>

            {tab !== 'requests' && (
                <Group justify="flex-end">
                    <BasicSort widthQuery={width} handleSort={(newSort) => setFilter(newSort || 'added_desc')} data={sortValueKey} defaultValue="added_desc" value={filter} />
                </Group>
            )}

            <ListWrapper numberOfPages={totalPages} isPending={false} currentPage={currentPage} onPageChange={setCurrentPage} searchBar={null} editButtons={null}>
                {tab === 'posts' && <PostList posts={sortedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} communityId={community._id} />}
                {tab === 'recipes' && <RecipeList recipes={sortedRecipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} userInfo={userInfo} />}
                {tab === 'members' && <MemberList members={displayMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} community={community} />}
                {tab === 'requests' && <RequestList requests={requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} canManage={userIsAdmin} />}
            </ListWrapper>
        </Stack>
    );
}

function PostList({ posts, communityId }: { posts: IPost[], communityId: string }) {
    if (posts.length === 0) {
        return (
            <EmptyState
                title="No posts yet"
                description="Share a recipe, ask a food question, or start a cooking discussion."
            />
        );
    }

    return posts.map((post, index) => <PostCard key={post._id} index={index} post={post} communityId={communityId} />);
}

function RecipeList({ recipes, userInfo }: { recipes: IRecipe[], userInfo: IUser | null }) {
    if (recipes.length === 0) {
        return (
            <EmptyState
                title="No recipes yet"
                description="Add a recipe to give this community something delicious to build around."
            />
        );
    }

    return (
        <Stack gap="sm" w="100%">
            {recipes.map(recipe => (
                <Card
                    key={recipe._id}
                    component={Link}
                    href={`/view/recipe/${recipe._id}`}
                    withBorder
                    radius="md"
                    padding="md"
                    className="w-full bg-mainBack/60 transition-colors hover:bg-secondaryBack"
                >
                    <Group justify="space-between" gap="md" wrap="nowrap">
                        <Group gap="sm" className="min-w-0" wrap="nowrap">
                            <ThemeIcon variant="light" color="accent" radius="md">
                                <IconBook2 size={18} />
                            </ThemeIcon>
                            <div className="min-w-0">
                                <Group gap="xs">
                                    <Text fw={700} className="truncate">{recipe.name || 'Untitled recipe'}</Text>
                                    {recipe.recipeType && (
                                        <Badge variant="light" color="gray">
                                            {recipe.recipeType}
                                        </Badge>
                                    )}
                                </Group>
                                <Text size="sm" c="dimmed" className="truncate">
                                    {recipe.description || 'Community recipe'}
                                </Text>
                            </div>
                        </Group>
                        <Group gap="xs" wrap="nowrap" className="shrink-0">
                            {recipe.cookingTime ? (
                                <Badge variant="light" color="gray" leftSection={<IconClock size={12} />}>
                                    {recipe.cookingTime} min
                                </Badge>
                            ) : null}
                            {recipe.creatorID === userInfo?._id ? <Badge variant="light" color="blue">Yours</Badge> : null}
                        </Group>
                    </Group>
                </Card>
            ))}
        </Stack>
    );
}

function MemberList({ members, community }: { members: IUser[], community: ICommunity }) {
    if (members.length === 0) {
        return <EmptyState title="No members found" description="Members will appear here after joining." />;
    }

    return (
        <Stack gap="sm" w="100%">
            {members.map(member => {
                const isCreator = community.creatorID === member._id;
                const isAdmin = community.adminIDs.includes(member._id) || isCreator;

                return (
                    <Card key={member._id} withBorder radius="md" padding="md" className="w-full bg-mainBack/60">
                        <Group justify="space-between" gap="sm">
                            <Group gap="sm" className="min-w-0">
                                <ThemeIcon variant="light" color={isAdmin ? 'yellow' : 'accent'} radius="md">
                                    <IconUserCircle size={18} />
                                </ThemeIcon>
                                <div className="min-w-0">
                                    <Text fw={700} className="truncate">{member.name}</Text>
                                    <Text size="sm" c="dimmed" className="truncate">{member.email}</Text>
                                </div>
                            </Group>
                            <Group gap="xs" wrap="nowrap">
                                {isCreator && <Badge variant="filled" color="accent">Creator</Badge>}
                                <Badge variant="light" color={isAdmin ? 'yellow' : 'gray'}>
                                    {isAdmin ? 'Admin' : 'Member'}
                                </Badge>
                            </Group>
                        </Group>
                    </Card>
                );
            })}
        </Stack>
    );
}

function RequestList({ requests, canManage }: { requests: IRequest[], canManage: boolean }) {
    const [busyId, setBusyId] = useState<string | null>(null);

    const decide = async (requestID: string, action: 'approved' | 'rejected') => {
        setBusyId(requestID);
        try {
            const response = await fetch('/api/community/request', {
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

    if (requests.length === 0) {
        return <EmptyState title="No pending requests" description="New join requests will appear here for admin review." />;
    }

    return (
        <Stack gap="sm" w="100%">
            {requests.map(request => (
                <Card key={request._id} withBorder radius="md" padding="md" className="w-full bg-mainBack/60">
                    <Group justify="space-between" align="flex-start" gap="md">
                        <Stack gap={6} className="min-w-0">
                            <Group gap="xs">
                                <Badge variant="light" color="yellow">Pending</Badge>
                                <Text size="xs" c="dimmed">{new Date(request.createdAt).toLocaleDateString()}</Text>
                            </Group>
                            <Text fw={700}>{request.requesterName || 'Community request'}</Text>
                            <Text size="sm" c="dimmed">{request.requesterEmail}</Text>
                            <Text size="sm">{request.message}</Text>
                        </Stack>
                        {canManage && (
                            <Group gap="xs" wrap="nowrap">
                                <Button disabled={busyId !== null && busyId !== request._id} loading={busyId === request._id} onClick={() => decide(request._id, 'approved')} color="green" leftSection={<BiCheck />}>
                                    Approve
                                </Button>
                                <Button disabled={busyId !== null && busyId !== request._id} loading={busyId === request._id} onClick={() => decide(request._id, 'rejected')} color="red" variant="light" leftSection={<BiX />}>
                                    Reject
                                </Button>
                            </Group>
                        )}
                    </Group>
                </Card>
            ))}
        </Stack>
    );
}

function EmptyState({ title, description }: { title: string, description: string }) {
    return (
        <Card withBorder radius="md" padding="xl" className="w-full bg-mainBack/60 text-center">
            <Stack gap="xs" align="center">
                <ThemeIcon variant="light" color="accent" radius="xl" size="lg">
                    <IconInbox size={18} />
                </ThemeIcon>
                <Text fw={700}>{title}</Text>
                <Text size="sm" c="dimmed">{description}</Text>
            </Stack>
        </Card>
    );
}

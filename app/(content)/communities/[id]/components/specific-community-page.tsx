'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useCommunityStore } from "@/context/communityStore";
import { useStateStore } from "@/context/stateStore";
import { useUserStore } from "@/context/userStore";
import { ICommunity } from "@/models/types/community/community";
import { IPost } from "@/models/types/misc/post";
import { IRequest } from "@/models/types/misc/request";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Group,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    rem,
} from "@mantine/core";
import {
    IconBook2,
    IconMessageCircle,
    IconSettings,
    IconShieldCheck,
    IconUserCog,
    IconUsers,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import CommunitySettings from "./tabs/community-settings";
import InCommunityTab from "./tabs/in-community-tab";
import UserSettingsTab from "./tabs/user-settings";

type CommunityTab = 'posts' | 'members' | 'community-settings' | 'user-settings' | 'requests';

const validTabs: CommunityTab[] = ['posts', 'members', 'community-settings', 'user-settings', 'requests'];
const adminTabs: CommunityTab[] = ['community-settings', 'requests'];

export default function SpecificCommunityPage({
    userInfo,
    community,
    creator,
    admins,
    posts,
    recipes,
    userIsAdmin,
    userRecipes,
    members,
    requests,
}: {
    userInfo: IUser | null,
    community: ICommunity,
    creator: IUser | null,
    admins: IUser[] | null,
    posts: IPost[],
    recipes: IRecipe[],
    userIsAdmin: boolean,
    userRecipes: IRecipe[],
    members: IUser[] | null,
    requests: IRequest[]
}) {
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as CommunityTab | null;
    const requestedTabAllowed = tabFromUrl && validTabs.includes(tabFromUrl) && (userIsAdmin || !adminTabs.includes(tabFromUrl));
    const [activeTab, setActiveTab] = useState<CommunityTab>(requestedTabAllowed ? tabFromUrl : 'posts');

    const setCurrCommunity = useCommunityStore(state => state.setCommunity);
    const setLocalAdmins = useCommunityStore(state => state.setAdmins);
    const setLocalPosts = useCommunityStore(state => state.setCommunityPosts);
    const setLocalRecipes = useCommunityStore(state => state.setCommunityRecipes);
    const setLocalCreator = useCommunityStore(state => state.setCreator);
    const setUserRecipes = useUserStore(state => state.setUserRecipes);

    const localCreator = useCommunityStore(state => state.creator);
    const currCommunity = useCommunityStore(state => state.community);
    const localAdmins = useCommunityStore(state => state.admins);
    const localPosts = useCommunityStore(state => state.communityPosts);
    const localRecipes = useCommunityStore(state => state.communityRecipes);

    useEffect(() => {
        if (tabFromUrl && validTabs.includes(tabFromUrl) && (userIsAdmin || !adminTabs.includes(tabFromUrl))) {
            setActiveTab(tabFromUrl);
        } else if (tabFromUrl && adminTabs.includes(tabFromUrl) && !userIsAdmin) {
            setActiveTab('posts');
        }
    }, [tabFromUrl, userIsAdmin]);

    useEffect(() => {
        if (community) setCurrCommunity(community);
        if (creator) setLocalCreator(creator);
        if (admins) setLocalAdmins(admins);
        if (posts) setLocalPosts(posts);
        if (recipes) setLocalRecipes(recipes);
        if (userRecipes) setUserRecipes(userRecipes);
    }, [community, creator, admins, posts, recipes, userRecipes, setCurrCommunity, setLocalCreator, setLocalAdmins, setLocalPosts, setLocalRecipes, setUserRecipes]);

    const displayPosts = localPosts.length > 0 ? localPosts : posts;
    const displayRecipes = localRecipes.length > 0 ? localRecipes : recipes;
    const displayAdmins = localAdmins && localAdmins.length > 0 ? localAdmins : admins;
    const displayCreator = localCreator || creator;
    const displayCommunity = currCommunity._id ? currCommunity : community;
    const displayMembers = members || [];
    const memberCount = new Set([
        ...displayCommunity.communityMemberIDs,
        ...displayCommunity.adminIDs,
        displayCommunity.creatorID,
    ].filter(Boolean)).size;
    const isMember = !!userInfo && (
        displayCommunity.communityMemberIDs.includes(userInfo._id) ||
        displayCommunity.adminIDs.includes(userInfo._id) ||
        displayCommunity.creatorID === userInfo._id
    );
    const iconStyle = { width: rem(16), height: rem(16) };

    const handleLoading = (state: boolean) => {
        setGlobalLoading(state);
    };

    const handleTabChange = (tab: string | null) => {
        const nextTab = (tab || 'posts') as CommunityTab;
        setActiveTab(nextTab);
        window.history.pushState({}, '', `/communities/${displayCommunity._id}?tab=${nextTab}`);
    };

    return (
        <NavWrapper userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <Container size="xl" px="sm" w="100%">
                    <Stack gap="lg">
                        <Card withBorder radius="md" padding="lg" className="bg-secondaryBack">
                            <Stack gap="md">
                                <Group justify="space-between" align="flex-start" gap="md">
                                    <Stack gap="sm" className="min-w-0">
                                        <Group gap="xs">
                                            <Badge variant="light" color={displayCommunity.privacyLevel === 'public' ? 'green' : 'yellow'}>
                                                {displayCommunity.privacyLevel}
                                            </Badge>
                                            {isMember && <Badge variant="light" color="blue">Member</Badge>}
                                            {userIsAdmin && <Badge variant="filled" color="accent">Admin</Badge>}
                                        </Group>
                                        <div>
                                            <Text component="h1" fw={800} size="xl" className="text-mainText">
                                                {displayCommunity.name}
                                            </Text>
                                            <Text size="sm" c="dimmed" maw={780}>
                                                {displayCommunity.description || 'A recipe-focused community for sharing posts, recipes, questions, and food ideas.'}
                                            </Text>
                                        </div>
                                        {displayCommunity.tags.length > 0 && (
                                            <Group gap="xs">
                                                {displayCommunity.tags.slice(0, 8).map(tag => (
                                                    <Badge key={tag} variant="outline" color="gray">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        )}
                                    </Stack>

                                    <Button
                                        type="button"
                                        variant="light"
                                        color="accent"
                                        onClick={() => handleTabChange(isMember ? 'posts' : 'user-settings')}
                                    >
                                        {isMember ? 'Start sharing' : 'Join community'}
                                    </Button>
                                </Group>

                                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
                                    <CommunityMetric icon={<IconMessageCircle size={18} />} label="Posts" value={displayPosts.length} />
                                    <CommunityMetric icon={<IconBook2 size={18} />} label="Recipes" value={displayRecipes.length} />
                                    <CommunityMetric icon={<IconUsers size={18} />} label="Members" value={memberCount || displayMembers.length} />
                                    <CommunityMetric icon={<IconShieldCheck size={18} />} label="Admins" value={displayAdmins?.length || 0} />
                                </SimpleGrid>
                            </Stack>
                        </Card>

                        <Card withBorder radius="md" padding="lg" className="bg-cardBack">
                            <Tabs value={activeTab} onChange={handleTabChange} variant="pills" radius="md">
                                <Tabs.List grow>
                                    <Tabs.Tab value="posts" leftSection={<IconMessageCircle style={iconStyle} />}>Posts</Tabs.Tab>
                                    <Tabs.Tab value="members" leftSection={<IconUsers style={iconStyle} />}>Members</Tabs.Tab>
                                    {userIsAdmin && (
                                        <Tabs.Tab
                                            value="requests"
                                            leftSection={<IconShieldCheck style={iconStyle} />}
                                            rightSection={requests.length > 0 ? <Badge size="xs" color="red" circle>{requests.length}</Badge> : null}
                                        >
                                            Requests
                                        </Tabs.Tab>
                                    )}
                                    <Tabs.Tab value="user-settings" leftSection={<IconUserCog style={iconStyle} />}>Membership</Tabs.Tab>
                                    {userIsAdmin && <Tabs.Tab value="community-settings" leftSection={<IconSettings style={iconStyle} />}>Settings</Tabs.Tab>}
                                </Tabs.List>

                                <Box pt="lg">
                                    <Tabs.Panel value="posts">
                                        <InCommunityTab tab="posts" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={displayMembers} userIsAdmin={userIsAdmin} requests={requests} />
                                    </Tabs.Panel>
                                    <Tabs.Panel value="members">
                                        <InCommunityTab tab="members" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={displayMembers} userIsAdmin={userIsAdmin} requests={requests} />
                                    </Tabs.Panel>
                                    {userIsAdmin && (
                                        <Tabs.Panel value="requests">
                                            <InCommunityTab tab="requests" posts={displayPosts} recipes={displayRecipes} admins={displayAdmins} creator={displayCreator} userInfo={userInfo} community={displayCommunity} members={displayMembers} userIsAdmin={userIsAdmin} requests={requests} />
                                        </Tabs.Panel>
                                    )}
                                    <Tabs.Panel value="user-settings">
                                        <UserSettingsTab isAdmin={userIsAdmin} community={displayCommunity} userInfo={userInfo} />
                                    </Tabs.Panel>
                                    {userIsAdmin && (
                                        <Tabs.Panel value="community-settings">
                                            <CommunitySettings communityID={displayCommunity._id} handleLoading={handleLoading} />
                                        </Tabs.Panel>
                                    )}
                                </Box>
                            </Tabs>
                        </Card>
                    </Stack>
                </Container>
            </ContentWrapper>
        </NavWrapper>
    );
}

function CommunityMetric({ icon, label, value }: { icon: ReactNode, label: string, value: number }) {
    return (
        <Card withBorder radius="md" padding="sm" className="bg-mainBack/60">
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="accent" radius="md">
                    {icon}
                </ThemeIcon>
                <div className="min-w-0">
                    <Text size="xs" c="dimmed">{label}</Text>
                    <Text fw={800}>{value}</Text>
                </div>
            </Group>
        </Card>
    );
}

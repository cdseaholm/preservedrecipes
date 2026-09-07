'use client'

import { useEffect, useState } from "react";
import { IUser } from "@/models/types/personal/user";
import { IFamily } from "@/models/types/family/family";
import { IReview } from "@/models/types/misc/review";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IInquiry } from "@/models/types/misc/inquiry";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { DashboardCard } from "@/components/layout/page-shells";
import { ICommunity } from "@/models/types/community/community";
import ProfileStats from "./profile-stats";
import RecentActivity from "./recent-activity";
import HistoryTabContent from "./accountHistory";
import ProfileInbox, { ProfileCommunityInvite, ProfileFamilyInvite } from "./profile-inbox";
import SettingsTab from "./settings-page";
import UserSpaceTemplate from "./user-space-template";
import UserSpaceTabs, { UserSpaceTab } from "./user-space-tabs";
import {
    Tabs,
    Button,
    Card,
    Group,
    Box,
    Stack,
    Text,
    Divider,
    Pagination,
} from "@mantine/core";
import {
    IconHistory,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/context/userStore";

type ProfilePanel = UserSpaceTab | 'stats' | 'history';

const profileTabs: ProfilePanel[] = ['activity', 'stats', 'history', 'inbox', 'settings'];
const visibleTabs: UserSpaceTab[] = ['activity', 'inbox', 'stats', 'settings'];
const profilePanelHeight = 'clamp(430px, min(58dvh, 46vw), 520px)';

interface ProfilePageProps {
    user: IUser;
    familyData: IFamily | null;
    reviews: IReview[];
    recentRecipes: IRecipe[];
    favoriteRecipes: IRecipe[];
    inquiries: IInquiry[];
    familyInvites: ProfileFamilyInvite[];
    communityInvites: ProfileCommunityInvite[];
    userIsInquiryAdmin: boolean;
    communitiesCreated: ICommunity[];
    communitiesJoined: ICommunity[];
}

export default function ProfilePage({
    user,
    familyData,
    reviews,
    recentRecipes,
    inquiries,
    familyInvites,
    communityInvites,
    userIsInquiryAdmin,
    communitiesCreated,
    communitiesJoined
}: ProfilePageProps) {

    const searchParams = useSearchParams();
    const requestedTab = searchParams.get('tab');
    const requestedProfileTab = requestedTab === 'inquiries' ? 'inbox' : requestedTab;
    const [activeTab, setActiveTab] = useState<ProfilePanel>(profileTabs.includes(requestedProfileTab as ProfilePanel) ? requestedProfileTab as ProfilePanel : 'activity');
    const [liveInboxCount, setLiveInboxCount] = useState<number | null>(null);

    useEffect(() => {
        if (requestedProfileTab && profileTabs.includes(requestedProfileTab as ProfilePanel)) {
            setActiveTab(requestedProfileTab as ProfilePanel);
        }
    }, [requestedProfileTab]);

    const recipeCount = user.recipeIDs?.length || 0;
    const communityCount = user.communityIDs?.length || 0;
    const favoriteCount = user.favoriteRecipeIDs?.length || 0;
    const storedInquiries = useUserStore(state => state.inquiries);
    const inquiriesForBadge = storedInquiries.length > 0 ? storedInquiries : inquiries;
    const openInquiryCount = inquiriesForBadge.filter(inquiry => !inquiry.handled).length;
    const unreadInquiryCount = inquiriesForBadge.filter(inquiry => !inquiry.read).length;
    const unreadInviteCount = familyInvites.filter(invite => !invite.read).length + communityInvites.filter(invite => !invite.read).length;
    const fallbackInboxCount = userIsInquiryAdmin ? openInquiryCount : unreadInquiryCount + unreadInviteCount;
    const inboxCount = liveInboxCount ?? fallbackInboxCount;
    const timeBeingMember = user.createdAt
        ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const ratingsGiven = reviews.filter(rc => rc.rating !== null).length;
    const commentsMade = reviews.filter(rc => rc.comment !== null).length;

    // Calculate profile completeness
    const calculateCompleteness = () => {
        let score = 0;
        const fields = [
            user.name,
            user.email,
            user.bio,
            user.profileImage,
            user.userFamilyID,
            recipeCount > 0,
            favoriteCount > 0,
            reviews.length > 0
        ];

        fields.forEach(field => {
            if (field) score += 12.5; // 8 fields = 100%
        });

        return Math.round(score);
    };

    const completeness = calculateCompleteness();
    const activeVisibleTab = visibleTabs.includes(activeTab as UserSpaceTab) ? activeTab as UserSpaceTab : 'settings';

    const handleMainTabChange = (tab: UserSpaceTab) => {
        setActiveTab(tab);
    };

    const openUtilityPanel = (tab: 'stats' | 'history') => {
        setActiveTab(tab);
        window.history.pushState({}, '', `/u/profile?tab=${tab}`);
    };

    return (
        <NavWrapper userInfo={user}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <UserSpaceTemplate user={user} familyData={familyData} completeness={completeness} />
                <DashboardCard
                    className="gap-2"
                    style={{ height: 'auto' }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(value) => setActiveTab((value || 'activity') as ProfilePanel)}
                        variant="pills"
                        radius="md"
                        w={'100%'}
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <UserSpaceTabs value={activeVisibleTab} inboxCount={inboxCount} showRecipesLink onTabChange={handleMainTabChange} />

                        <Divider mt={8} />

                        <Box pt={8} style={{ height: profilePanelHeight, minHeight: profilePanelHeight, position: 'relative', overflow: 'hidden' }}>
                            <Tabs.Panel value="activity" className="h-full overflow-hidden pr-1" style={{ height: '100%', minHeight: '100%' }}>
                                <DashboardOverview
                                    recentRecipes={recentRecipes}
                                    reviews={reviews}
                                    onOpenHistory={() => openUtilityPanel('history')}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="stats" className="h-full overflow-hidden pr-1" style={{ height: '100%', minHeight: '100%' }}>
                                <ProfileStats
                                    recipeCount={recipeCount}
                                    communityCount={communityCount}
                                    favoriteCount={favoriteCount}
                                    ratingsGiven={ratingsGiven}
                                    commentsMade={commentsMade}
                                    timeBeingMember={timeBeingMember}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="history" className="h-full overflow-hidden pr-1" style={{ height: '100%', minHeight: '100%' }}>
                                <Card withBorder radius="md" padding="md" className="mb-4 border-accent/15 bg-mainBack/60">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                                        onClick={() => {
                                            setActiveTab('activity');
                                            window.history.pushState({}, '', '/u/profile?tab=activity');
                                        }}
                                    >
                                        <IconHistory size={16} aria-hidden="true" />
                                        Back to activity
                                    </button>
                                </Card>
                                <div className="h-[calc(100%-4.25rem)] overflow-y-auto pr-1">
                                    <HistoryTabContent
                                        recipesCreated={recentRecipes}
                                        communitiesCreated={communitiesCreated}
                                        communitiesJoined={communitiesJoined}
                                        inquiriesMade={inquiries}
                                        reviews={reviews}
                                    />
                                </div>
                            </Tabs.Panel>

                            <Tabs.Panel value="inbox" className="h-full overflow-hidden pr-1" style={{ height: '100%', minHeight: '100%' }}>
                                <ProfileInbox
                                    familyInvites={familyInvites}
                                    communityInvites={communityInvites}
                                    initialInquiries={inquiries}
                                    user={user}
                                    isAdmin={userIsInquiryAdmin}
                                    onInboxCountChange={setLiveInboxCount}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="settings" className="h-full overflow-hidden pr-1" style={{ height: '100%', minHeight: '100%' }}>
                                <SettingsTab />
                            </Tabs.Panel>
                        </Box>
                    </Tabs>
                </DashboardCard>
            </ContentWrapper>
        </NavWrapper>
    );
}

function DashboardOverview({
    recentRecipes,
    reviews,
    onOpenHistory,
}: {
    recentRecipes: IRecipe[];
    reviews: IReview[];
    onOpenHistory: () => void;
}) {
    const [activityPage, setActivityPage] = useState(1);
    const activityPageSize = 3;
    const totalActivities = recentRecipes.length + reviews.length;
    const activityPages = Math.max(1, Math.ceil(totalActivities / activityPageSize));
    const activityOffset = (activityPage - 1) * activityPageSize;

    useEffect(() => {
        setActivityPage(currentPage => Math.min(currentPage, activityPages));
    }, [activityPages]);

    return (
        <Stack gap="md" w={'100%'} h={'100%'} className="min-h-0">
            <section className="flex h-full min-h-0 w-full flex-col rounded-md border border-accent/15 bg-cardBack/75 shadow-[var(--tightShadow)]">
                <Group justify="space-between" align="center" gap="xs" wrap="nowrap" className="border-b border-accent/10 p-3 sm:p-4">
                    <div className="min-w-0">
                        <Text fw={800} size="lg">Recent activity</Text>
                        <Text size="sm" c="dimmed" lineClamp={2}>A quick look at what you have been preserving lately.</Text>
                    </div>
                    <Button type="button" variant="light" color="accent" size="xs" leftSection={<IconHistory size={15} />} onClick={onOpenHistory} className="shrink-0">
                        See more
                    </Button>
                </Group>
                <div className="min-h-0 w-full flex-1 p-1.5 sm:p-3">
                    <RecentActivity
                        recentRecipes={recentRecipes}
                        reviews={reviews}
                        limit={activityPageSize}
                        offset={activityOffset}
                    />
                </div>
                {activityPages > 1 && (
                    <Group justify="center" className="border-t border-accent/10 px-3 py-2">
                        <Pagination total={activityPages} value={activityPage} onChange={setActivityPage} size="sm" withEdges />
                    </Group>
                )}
            </section>
        </Stack>
    );
}

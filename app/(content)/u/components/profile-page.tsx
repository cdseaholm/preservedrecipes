'use client'

import { useEffect, useState } from "react";
import { IUser } from "@/models/types/personal/user";
import { IFamily } from "@/models/types/family/family";
import { IReview } from "@/models/types/misc/review";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IInquiry } from "@/models/types/misc/inquiry";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { ICommunity } from "@/models/types/community/community";
import ProfileStats from "./profile-stats";
import RecentActivity from "./recent-activity";
import HistoryTabContent from "./accountHistory";
import ProfileInbox, { ProfileFamilyInvite } from "./profile-inbox";
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
} from "@mantine/core";
import {
    IconHistory,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/context/userStore";

type ProfilePanel = UserSpaceTab | 'stats' | 'history';

const profileTabs: ProfilePanel[] = ['activity', 'stats', 'history', 'inbox', 'settings'];
const visibleTabs: UserSpaceTab[] = ['activity', 'inbox', 'stats', 'settings'];

interface ProfilePageProps {
    user: IUser;
    familyData: IFamily | null;
    reviews: IReview[];
    recentRecipes: IRecipe[];
    favoriteRecipes: IRecipe[];
    inquiries: IInquiry[];
    familyInvites: ProfileFamilyInvite[];
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
    userIsInquiryAdmin,
    communitiesCreated,
    communitiesJoined
}: ProfilePageProps) {

    const searchParams = useSearchParams();
    const requestedTab = searchParams.get('tab');
    const requestedProfileTab = requestedTab === 'inquiries' ? 'inbox' : requestedTab;
    const [activeTab, setActiveTab] = useState<ProfilePanel>(profileTabs.includes(requestedProfileTab as ProfilePanel) ? requestedProfileTab as ProfilePanel : 'activity');

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
    const inboxCount = openInquiryCount + familyInvites.length;
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
                {/* Tabs Section - Takes remaining space */}
                <Card
                    shadow="sm"
                    padding="md"
                    radius="md"
                    w={'100%'}
                    withBorder
                    style={{
                        flex: 1,
                        minHeight: '0',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
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

                        <Divider mt={12} />

                        <Box pt="sm" style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                            <Tabs.Panel value="activity">
                                <DashboardOverview
                                    recentRecipes={recentRecipes}
                                    reviews={reviews}
                                    onOpenHistory={() => openUtilityPanel('history')}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="stats">
                                <ProfileStats
                                    recipeCount={recipeCount}
                                    communityCount={communityCount}
                                    favoriteCount={favoriteCount}
                                    ratingsGiven={ratingsGiven}
                                    commentsMade={commentsMade}
                                    timeBeingMember={timeBeingMember}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="history">
                                <Card withBorder radius="md" padding="md" className="mb-4 bg-mainBack/60">
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
                                <HistoryTabContent
                                    recipesCreated={recentRecipes}
                                    communitiesCreated={communitiesCreated}
                                    communitiesJoined={communitiesJoined}
                                    inquiriesMade={inquiries}
                                    reviews={reviews}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="inbox">
                                <ProfileInbox
                                    familyInvites={familyInvites}
                                    initialInquiries={inquiries}
                                    user={user}
                                    isAdmin={userIsInquiryAdmin}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="settings">
                                <SettingsTab />
                            </Tabs.Panel>
                        </Box>
                    </Tabs>
                </Card>
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

    return (
        <Stack gap="xl" w={'100%'} h={'100%'}>
            <section className="flex min-h-[420px] w-full flex-col rounded-md border border-accent/30 bg-cardBack sm:min-h-[520px]">
                <Group justify="space-between" align="center" gap="sm" className="p-4">
                    <div className="min-w-0">
                        <Text fw={800} size="lg">Recent activity</Text>
                        <Text size="sm" c="dimmed">A quick look at what you have been preserving lately.</Text>
                    </div>
                    <Button type="button" variant="light" color="accent" leftSection={<IconHistory size={16} />} onClick={onOpenHistory} className="shrink-0">
                        See more
                    </Button>
                </Group>
                <div className="w-full flex-1 p-0 shadow-none sm:p-3 sm:shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)]">
                    <RecentActivity recentRecipes={recentRecipes} reviews={reviews} limit={6} />
                </div>
            </section>
        </Stack>
    );
}

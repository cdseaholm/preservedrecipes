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
import ProfileHeader from "./profile-header";
import HistoryTabContent from "./accountHistory";
import InquiryTabContent from "./inquiry-tab";
import SettingsTab from "./settings-page";
import { 
    Tabs, 
    Card, 
    Badge,
    Stack,
    Container,
    Box,
    rem
} from "@mantine/core";
import { 
    IconChartLine, 
    IconChartBar, 
    IconHistory, 
    IconMessageCircle, 
    IconSettings 
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/context/userStore";

const profileTabs = ['activity', 'stats', 'history', 'inquiries', 'settings'];

interface ProfilePageProps {
    user: IUser;
    familyData: IFamily | null;
    reviews: IReview[];
    recentRecipes: IRecipe[];
    favoriteRecipes: IRecipe[];
    inquiries: IInquiry[];
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
    userIsInquiryAdmin,
    communitiesCreated,
    communitiesJoined
}: ProfilePageProps) {

    const searchParams = useSearchParams();
    const requestedTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(profileTabs.includes(requestedTab || '') ? requestedTab || 'activity' : 'activity');

    useEffect(() => {
        if (requestedTab && profileTabs.includes(requestedTab)) {
            setActiveTab(requestedTab);
        }
    }, [requestedTab]);

    const recipeCount = user.recipeIDs?.length || 0;
    const communityCount = user.communityIDs?.length || 0;
    const favoriteCount = user.favoriteRecipeIDs?.length || 0;
    const storedInquiries = useUserStore(state => state.inquiries);
    const inquiriesForBadge = storedInquiries.length > 0 ? storedInquiries : inquiries;
    const openInquiryCount = inquiriesForBadge.filter(inquiry => !inquiry.handled).length;
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

    const iconStyle = { width: rem(16), height: rem(16) };

    return (
        <NavWrapper userInfo={user}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <Container size="xl" px="sm" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} w={"100%"}>
                    <Stack gap="lg" style={{ flex: 1, minHeight: '75dvh' }}>
                        {/* Profile Header */}
                        <ProfileHeader
                            user={user}
                            familyData={familyData}
                            completeness={completeness}
                        />

                        {/* Tabs Section - Takes remaining space */}
                        <Card 
                            shadow="sm" 
                            padding="lg" 
                            radius="md" 
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
                                onChange={(value) => setActiveTab(value || 'activity')}
                                variant="pills"
                                radius="md"
                                style={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Tabs.List grow>
                                    <Tabs.Tab 
                                        value="activity" 
                                        leftSection={<IconChartLine style={iconStyle} />}
                                        bd={'1px solid #ceb5a4ff'}
                                    >
                                        Activity
                                    </Tabs.Tab>
                                    <Tabs.Tab 
                                        value="stats" 
                                        leftSection={<IconChartBar style={iconStyle} />}
                                        bd={'1px solid #ceb5a4ff'}
                                    >
                                        Stats
                                    </Tabs.Tab>
                                    <Tabs.Tab 
                                        value="history" 
                                        leftSection={<IconHistory style={iconStyle} />}
                                        bd={'1px solid #ceb5a4ff'}
                                    >
                                        History
                                    </Tabs.Tab>
                                    <Tabs.Tab 
                                        value="inquiries" 
                                        leftSection={<IconMessageCircle style={iconStyle} />}
                                        bd={'1px solid #ceb5a4ff'}
                                        rightSection={
                                            openInquiryCount > 0 ? (
                                                <Badge size="xs" variant="filled" color="red" circle>
                                                    {openInquiryCount}
                                                </Badge>
                                            ) : null
                                        }
                                    >
                                        Inquiries
                                    </Tabs.Tab>
                                    <Tabs.Tab 
                                        value="settings" 
                                        leftSection={<IconSettings style={iconStyle} />}
                                        bd={'1px solid #ceb5a4ff'}
                                    >
                                        Settings
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Box pt="xl" style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                                    <Tabs.Panel value="activity">
                                        <RecentActivity 
                                            recentRecipes={recentRecipes} 
                                            reviews={reviews} 
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
                                        <HistoryTabContent
                                            recipesCreated={recentRecipes}
                                            communitiesCreated={communitiesCreated}
                                            communitiesJoined={communitiesJoined}
                                            inquiriesMade={inquiries}
                                            reviews={reviews}
                                        />
                                    </Tabs.Panel>

                                    <Tabs.Panel value="inquiries">
                                        <InquiryTabContent
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
                    </Stack>
                </Container>
            </ContentWrapper>
        </NavWrapper>
    );
}

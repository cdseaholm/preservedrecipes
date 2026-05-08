'use client'

import { useNavigation } from "@/components/hooks/menu/use-navigation-hook";
import { useWindowSizes } from "@/context/width-height-store";
import { Badge, Button, Divider, Group, Tabs, rem } from "@mantine/core";
import { IconChartBar, IconChartLine, IconInbox, IconSettings, IconSquareChevronRight } from "@tabler/icons-react";
import { toast } from "sonner";

export type UserSpaceTab = 'activity' | 'inbox' | 'stats' | 'settings';

export default function UserSpaceTabs({
    value,
    inboxCount = 0,
    showRecipesLink = false,
    onTabChange,
}: {
    value?: UserSpaceTab;
    inboxCount?: number;
    showRecipesLink?: boolean;
    onTabChange?: (value: UserSpaceTab) => void;
}) {
    const { navigate } = useNavigation();
    const { width } = useWindowSizes();
    const activeTab: UserSpaceTab = value || 'activity';
    const iconStyle = { width: rem(16), height: rem(16) };
    const mobile = width <= 768;

    const tabs = [
        { label: <IconChartLine style={iconStyle} />, labelTitle: 'Activity', value: 'activity', href: '/u/profile?tab=activity' },
        { label: <IconInbox style={iconStyle} />, labelTitle: 'Inbox', value: 'inbox', href: '/u/profile?tab=inbox', count: inboxCount },
        { label: <IconChartBar style={iconStyle} />, labelTitle: 'Stats', value: 'stats', href: '/u/profile?tab=stats' },
        { label: <IconSettings style={iconStyle} />, labelTitle: 'Settings', value: 'settings', href: '/u/profile?tab=settings' },
    ] as const;

    return (
        <Group gap="sm" wrap={mobile ? 'wrap' : 'nowrap'} align="stretch" w="100%">
            <Tabs
                w={showRecipesLink && !mobile ? 'auto' : '100%'}
                className={showRecipesLink && !mobile ? 'flex-1' : undefined}
                h="fit-content"
                value={activeTab}
                variant="pills"
                radius="md"
                onChange={(nextValue) => {
                    const tab = tabs.find(item => item.value === nextValue);
                    if (!tab) {
                        toast.error("Invalid tab selection");
                        return;
                    }

                    if (tab.value !== activeTab && onTabChange) {
                        onTabChange(tab.value);
                        window.history.pushState({}, '', tab.href);
                    }
                }}
            >
                <div className={mobile ? "flex w-full flex-col items-start justify-start space-y-1 px-4" : "flex h-content w-full flex-row items-end justify-between px-2"}>
                    <Tabs.List w="100%" grow>
                        {tabs.map((tab) => (
                            <Tabs.Tab
                                key={tab.value}
                                value={tab.value}
                                leftSection={mobile ? undefined : tab.label}
                                rightSection={'count' in tab && tab.count > 0 ? (
                                    <Badge size="xs" variant="filled" color="red" circle>
                                        {tab.count}
                                    </Badge>
                                ) : undefined}
                                styles={mobile ? { tabLabel: { fontSize: '12px', fontWeight: 500 } } : undefined}
                                title={tab.labelTitle}
                                bd="1px solid #ceb5a4ff"
                            >
                                {mobile ? tab.label : tab.labelTitle}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </div>
            </Tabs>

            {showRecipesLink && (
                <>
                    {!mobile && <Divider orientation="vertical" />}
                    <Button
                        type="button"
                        variant="light"
                        color="accent"
                        h={rem(36)}
                        bd="1px solid #ceb5a4ff"
                        radius="md"
                        rightSection={<IconSquareChevronRight size={18} />}
                        onClick={() => navigate('/u/recipes')}
                        className={mobile ? 'w-full' : 'shrink-0'}
                    >
                        Recipes
                    </Button>
                </>
            )}
        </Group>
    );
}

'use client'

import { useWindowSizes } from "@/context/width-height-store";
import { Badge, Button, Divider, Group, Tabs, rem } from "@mantine/core";
import { IconChartBar, IconChartLine, IconInbox, IconSettings, IconSquareChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStateStore } from "@/context/stateStore";

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
    const router = useRouter();
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const { width } = useWindowSizes();
    const mobile = width < 640;
    const activeTab: UserSpaceTab = value || 'activity';
    const iconStyle = { width: rem(16), height: rem(16) };

    const tabs = [
        { label: <IconChartLine style={iconStyle} />, labelTitle: 'Activity', value: 'activity', href: '/u/profile?tab=activity' },
        { label: <IconInbox style={iconStyle} />, labelTitle: 'Inbox', value: 'inbox', href: '/u/profile?tab=inbox', count: inboxCount },
        { label: <IconChartBar style={iconStyle} />, labelTitle: 'Stats', value: 'stats', href: '/u/profile?tab=stats' },
        { label: <IconSettings style={iconStyle} />, labelTitle: 'Settings', value: 'settings', href: '/u/profile?tab=settings' },
    ] as const;

    return (
        <Group gap="xs" wrap="nowrap" align="stretch" w="100%" className="min-w-0 rounded-md border border-accent/10 bg-mainBack/45 p-1.5 sm:p-2">
            <Tabs
                w={showRecipesLink ? 'auto' : '100%'}
                className="min-w-0 flex-1"
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
                <div className="flex h-content w-full flex-row items-end justify-between">
                    <Tabs.List w="100%" grow className="min-w-0">
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
                                styles={{
                                    tab: { minWidth: 0, paddingInline: rem(8) },
                                    tabLabel: { minWidth: 0, fontSize: mobile ? '13px' : rem(12), fontWeight: mobile ? 600 : 500 },
                                }}
                                title={tab.labelTitle}
                                bd={mobile ? "0" : "1px solid var(--surfaceBorder)"}
                                className={mobile ? "min-w-0 px-1.5" : undefined}
                            >
                                <span className="relative inline-flex min-h-4 min-w-4 items-center justify-center">
                                    {mobile ? tab.label : tab.labelTitle}
                                    {mobile && 'count' in tab && tab.count > 0 ? (
                                        <span className="absolute -right-3 -top-2 inline-flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </span>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </div>
            </Tabs>

            {showRecipesLink && (
                <>
                    <Divider orientation="vertical" visibleFrom="sm" />
                    <Button
                        type="button"
                        variant="light"
                        color="accent"
                        h={mobile ? rem(37) : rem(36)}
                        bd="1px solid var(--surfaceBorder)"
                        radius="md"
                        rightSection={<IconSquareChevronRight size={18} />}
                        onClick={() => {
                            setIsNavigating(true);
                            router.push('/u/recipes');
                        }}
                        className={mobile ? 'w-[5.6rem] shrink-0 px-2 text-xs' : 'min-w-[108px] shrink-0 px-2'}
                    >
                        Recipes
                    </Button>
                </>
            )}
        </Group>
    );
}

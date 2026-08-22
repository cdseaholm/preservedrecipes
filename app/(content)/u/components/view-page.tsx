'use client'

import { ChangeEvent, useMemo, useState } from "react";
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import { DashboardCard, DashboardHeader, DashboardStatsGrid } from "@/components/layout/page-shells";
import { IUserView } from "@/models/types/family/member-view";
import SearchBar from "@/components/misc/searchBox/searchBar";
import ListWrapper from "@/components/wrappers/list-wrapper";
import {
    Badge,
    Box,
    Combobox,
    Divider,
    Group,
    Input,
    InputBase,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    rem,
    useCombobox,
} from "@mantine/core";
import { DateValue, DatePicker } from "@mantine/dates";
import {
    IconBook2,
    IconCalendar,
    IconChevronRight,
    IconMessageCircle,
    IconSearch,
    IconUsers,
    IconUserCircle,
    IconWorld,
} from "@tabler/icons-react";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";

type MemberViewGroup = {
    label: string;
    description: string;
    emptyLabel: string;
    options: GroupItem[];
}

export type GroupItem = {
    title: string;
    description: string;
    meta: string;
    createdAt?: string;
    link: string | null;
    icon: "recipe" | "community" | "review" | "family";
}

const iconMap = {
    recipe: <IconBook2 size={18} />,
    community: <IconWorld size={18} />,
    review: <IconMessageCircle size={18} />,
    family: <IconUsers size={18} />,
};

export default function ViewPage({ memberToView }: { memberToView: IUserView }) {
    const combobox = useCombobox();
    const [loading, setLoading] = useState(false);
    const [dateValue, setDateValue] = useState<[DateValue | null, DateValue | null]>([null, null]);
    const [activeTab, setActiveTab] = useState<string | null>("all");
    const [search, setSearch] = useState('');
    const router = useRouter();

    const groups = useMemo<MemberViewGroup[]>(() => {
        const publicCommunityIds = new Set(memberToView.publicCommunities.map(community => community._id));
        const overlappingCommunities = memberToView.overlappingCommunities?.filter(community => publicCommunityIds.has(community._id)) ?? [];

        const groupList: MemberViewGroup[] = [
            {
                label: 'Recipes',
                description: 'Public recipes shared by this member',
                emptyLabel: 'No public recipes found',
                options: memberToView.publicRecipes.map(recipe => ({
                    title: recipe.name,
                    description: recipe.description || 'No description added',
                    meta: `${recipe.recipeType || 'Recipe'}${recipe.cookingTime ? ` - ${recipe.cookingTime} min` : ''}`,
                    createdAt: recipe.createdAt,
                    link: `/view/recipe/${recipe._id}`,
                    icon: 'recipe',
                })),
            },
            {
                label: 'Communities',
                description: 'Public communities they participate in',
                emptyLabel: 'No public communities found',
                options: memberToView.publicCommunities.map(community => ({
                    title: community.name,
                    description: community.description || 'No description added',
                    meta: `${community.communityMemberIDs?.length ?? 0} members`,
                    createdAt: community.createdAt,
                    link: `/communities/${community._id}`,
                    icon: 'community',
                })),
            },
            {
                label: 'Shared Communities',
                description: 'Public communities you both belong to',
                emptyLabel: 'No shared communities found',
                options: overlappingCommunities.map(community => ({
                    title: community.name,
                    description: community.description || 'No description added',
                    meta: `${community.communityMemberIDs?.length ?? 0} members`,
                    createdAt: community.createdAt,
                    link: `/communities/${community._id}`,
                    icon: 'community',
                })),
            },
            {
                label: 'Comments',
                description: 'Public comments and ratings from this member',
                emptyLabel: 'No public comments found',
                options: memberToView.publicReviews.map((review, index) => ({
                    title: review.comment ? `Comment ${index + 1}` : `Rating ${index + 1}`,
                    description: review.comment || 'Rating only',
                    meta: review.rating ? `${review.rating} stars` : 'No rating',
                    link: null,
                    icon: 'review',
                })),
            },
        ];

        if (memberToView.sameFamily) {
            groupList.push({
                label: 'Family',
                description: 'Family context visible to you',
                emptyLabel: 'No shared family found',
                options: [{
                    title: memberToView.sameFamily.name,
                    description: 'You are in the same family space',
                    meta: `${memberToView.sameFamily.familyMembers?.length ?? 0} members`,
                    link: `/family/${memberToView.sameFamily._id}`,
                    icon: 'family',
                }],
            });
        }

        return groupList;
    }, [memberToView]);

    const totalItems = groups.reduce((total, group) => total + group.options.length, 0);
    const stats = [
        {
            label: 'Recipes',
            value: memberToView.publicRecipes.length,
            icon: <IconBook2 size={22} />,
            description: 'Public recipes',
        },
        {
            label: 'Communities',
            value: memberToView.publicCommunities.length,
            icon: <IconWorld size={22} />,
            description: 'Public spaces',
        },
        {
            label: 'Shared',
            value: memberToView.overlappingCommunities?.length ?? 0,
            icon: <IconUsers size={22} />,
            description: 'Communities with you',
        },
        {
            label: 'Family',
            value: memberToView.sameFamily ? 1 : 0,
            icon: <IconUserCircle size={22} />,
            description: memberToView.sameFamily?.name ?? 'Not shared',
        },
    ];

    const formatDateValue = (dateVal: DateValue | null): string => {
        if (!dateVal) return '';

        let date: Date;

        if (dateVal instanceof Date) {
            date = dateVal;
        } else {
            const dateStr = String(dateVal);
            if (dateStr.includes('T')) {
                date = new Date(dateStr);
            } else {
                const [year, month, day] = dateStr.split('-').map(Number);
                date = new Date(year, month - 1, day);
            }
        }

        return date.toLocaleDateString('en-US');
    };

    const isInSelectedDateRange = (createdAt?: string) => {
        if (!dateValue[0]) return true;
        if (!createdAt) return false;

        const itemDate = new Date(createdAt);

        if (Number.isNaN(itemDate.getTime())) return false;

        if (!dateValue[1]) {
            const selectedDate = new Date(dateValue[0]);
            selectedDate.setHours(0, 0, 0, 0);
            const itemDateOnly = new Date(itemDate);
            itemDateOnly.setHours(0, 0, 0, 0);
            return itemDateOnly.getTime() === selectedDate.getTime();
        }

        return itemDate >= dateValue[0] && itemDate <= dateValue[1];
    };

    const visibleGroups = activeTab === "all" ? groups : groups.filter(group => group.label === activeTab);
    const filteredGroups = visibleGroups
        .map(group => ({
            ...group,
            options: group.options.filter(item => {
                const searchValue = search.toLowerCase().trim();
                const matchesSearch = !searchValue || `${item.title} ${item.description} ${item.meta}`.toLowerCase().includes(searchValue);
                return matchesSearch && isInSelectedDateRange(item.createdAt);
            }),
        }));

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        setSearch(e.currentTarget.value);
        setLoading(false);
    }

    return (
        <ContentWrapper containedChild={true} paddingNeeded={true}>
            <DashboardCard>
                <Stack gap="lg" w="100%">
                    <DashboardHeader
                        icon={<IconUserCircle size={20} />}
                        eyebrow={(
                            <>
                                <Badge variant="light" color="accent">
                                    Public Profile
                                </Badge>
                                {memberToView.sameFamily && (
                                    <Badge variant="outline" color="accent">
                                        Same family
                                    </Badge>
                                )}
                            </>
                        )}
                        title={memberToView.familyMemberName || 'RecipeSafe Member'}
                        description="Browse the recipes, communities, and shared family context this member has made visible to you."
                        aside={(
                            <Stack gap={4} align="flex-end">
                            <Text size="sm" c="dimmed">Visible items</Text>
                            <Text size="2rem" fw={800} c="accent" lh={1}>
                                {totalItems}
                            </Text>
                            </Stack>
                        )}
                    />

                    <DashboardStatsGrid stats={stats} />

                    <Divider />

                    <PageSpecButtonBox
                        leftHandButtons={
                            <Combobox store={combobox} withinPortal={false} width="auto">
                                <Combobox.Target>
                                    <InputBase
                                        label="Filter by Date(s)"
                                        component="button"
                                        type="button"
                                        pointer
                                        leftSection={<IconCalendar size={16} />}
                                        rightSection={dateValue[0] && (
                                            <IoMdClose
                                                size={16}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setDateValue([null, null]);
                                                }}
                                                className="cursor-pointer"
                                            />
                                        )}
                                        onClick={() => combobox.toggleDropdown()}
                                        className="w-full cursor-pointer sm:w-[240px]"
                                    >
                                        {dateValue[0] && !dateValue[1] ? (
                                            formatDateValue(dateValue[0])
                                        ) : dateValue[0] && dateValue[1] ? (
                                            `${formatDateValue(dateValue[0])} - ${formatDateValue(dateValue[1])}`
                                        ) : (
                                            <Input.Placeholder>No date selected</Input.Placeholder>
                                        )}
                                    </InputBase>
                                </Combobox.Target>
                                <Combobox.Dropdown w="auto" p={10}>
                                    <DatePicker
                                        type="range"
                                        value={dateValue}
                                        onChange={setDateValue}
                                        allowSingleDateInRange={true}
                                        locale="en-US"
                                    />
                                </Combobox.Dropdown>
                            </Combobox>
                        }
                        rightHandButtons={null}
                        leftLabel="Sort and Filter"
                        rightLabel="Filter"
                    />

                    <Tabs
                        value={activeTab}
                        onChange={setActiveTab}
                        variant="pills"
                        radius="md"
                        keepMounted={false}
                    >
                        <Tabs.List grow>
                            <Tabs.Tab value="all">
                                All
                            </Tabs.Tab>
                            {groups.map(group => (
                                <Tabs.Tab key={group.label} value={group.label}>
                                    {group.label}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        <Tabs.Panel value={activeTab ?? "all"} pt="md">
                            <ListWrapper
                                numberOfPages={1}
                                isPending={loading}
                                currentPage={1}
                                searchBar={
                                    <SearchBar
                                        handleSearch={handleSearch}
                                        searchString={search === '' ? 'Search public profile' : search}
                                        index={1}
                                        leftSection={<IconSearch size={18} />}
                                    />
                                }
                                editButtons={undefined}
                            >
                                <Stack gap="md" w="100%">
                                    {filteredGroups.map(group => (
                                        <Box key={group.label} w="100%">
                                            <Group justify="space-between" align="flex-end" mb="xs">
                                                <Stack gap={0}>
                                                    <Text fw={700}>{group.label}</Text>
                                                    <Text size="sm" c="dimmed">{group.description}</Text>
                                                </Stack>
                                                <Badge variant="light" color={group.options.length > 0 ? "accent" : "gray"}>
                                                    {group.options.length}
                                                </Badge>
                                            </Group>

                                            <Stack gap="xs">
                                                {group.options.length > 0 ? group.options.map(item => (
                                                    <button
                                                        key={`${group.label}-${item.title}-${item.link ?? item.meta}`}
                                                        type="button"
                                                        disabled={!item.link}
                                                        onClick={() => item.link && router.push(item.link)}
                                                        className="flex w-full items-center justify-between gap-3 rounded-md border border-accent/30 bg-cardBack px-4 py-3 text-left text-mainText transition hover:bg-gray-200 hover:text-highlight disabled:cursor-default disabled:hover:bg-cardBack disabled:hover:text-mainText"
                                                    >
                                                        <Group gap="sm" wrap="nowrap" className="min-w-0">
                                                            <ThemeIcon variant="light" color="accent" size="lg" radius="md" className="shrink-0">
                                                                {iconMap[item.icon]}
                                                            </ThemeIcon>
                                                            <Stack gap={2} className="min-w-0">
                                                                <Text fw={600} truncate>{item.title}</Text>
                                                                <Text size="sm" c="dimmed" truncate>{item.description}</Text>
                                                            </Stack>
                                                        </Group>
                                                        <Group gap="xs" wrap="nowrap" className="shrink-0">
                                                            <Text size="sm" c="dimmed" className="hidden sm:block" truncate maw={rem(160)}>
                                                                {item.meta}
                                                            </Text>
                                                            {item.link && <IconChevronRight size={18} />}
                                                        </Group>
                                                    </button>
                                                )) : (
                                                    <Box p="md" className="rounded-md border border-dashed border-accent/30 bg-mainBack/60">
                                                        <Text size="sm" c="dimmed" ta="center">
                                                            {group.emptyLabel}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </ListWrapper>
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </DashboardCard>
        </ContentWrapper>
    );
}

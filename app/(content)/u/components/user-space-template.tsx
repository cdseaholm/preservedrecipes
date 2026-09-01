'use client'

import { useUserStore } from "@/context/userStore";
import { DashboardCard } from "@/components/layout/page-shells";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    CopyButton,
    Group,
    Progress,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import {
    IconCheck,
    IconEdit,
    IconShare,
    IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

export default function UserSpaceTemplate({
    user,
    familyData,
    completeness,
    primaryActionLabel = 'Edit Profile',
    primaryActionHref = '/u/profile?tab=settings',
}: {
    user: IUser;
    familyData?: IFamily | null;
    completeness?: number;
    primaryActionLabel?: string;
    primaryActionHref?: string;
}) {
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/view/member/${user._id}`;
    const completion = completeness ?? null;
    const completionColor = completion === null ? 'gray' : completion >= 75 ? 'green' : completion >= 50 ? 'yellow' : 'red';

    useEffect(() => {
        setUserInfo(user);
    }, [setUserInfo, user]);

    return (
        <div className="flex w-full min-w-0 flex-col items-center justify-start">
            <DashboardCard>
<<<<<<< Updated upstream
                <Stack gap="sm" style={{ flex: 1, minHeight: 0 }} w="100%">
                    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md bg-mainBack/45 p-3 ring-1 ring-accent/10 md:grid-cols-[minmax(0,1fr)_260px] md:items-start md:p-4">
                        <div className="grid min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
=======
                <Stack gap="md" style={{ flex: 1, minHeight: 0 }} w="100%">
                    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap" visibleFrom="sm">
                        <Group gap="md" align="flex-start" className="min-w-0 flex-1">
>>>>>>> Stashed changes
                            <Avatar
                                src={user.profileImage}
                                size={60}
                                radius="md"
                                alt={user.name || 'User avatar'}
                                className="shrink-0 ring-2 ring-accent/15 sm:size-[72px]"
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack gap={4} className="min-w-0">
                                {familyData && (
                                    <Badge leftSection={<IconUsers size={14} />} variant="light" color="accent" className="w-fit max-w-full">
                                        {familyData.name}
                                    </Badge>
                                )}
                                <Text component="h1" fw={800} className="break-words text-xl leading-tight text-mainText sm:text-2xl">
                                    {user.name || 'Your Profile'}
                                </Text>
                                <Text size="sm" c="dimmed" className="break-all leading-snug sm:break-normal">
                                    {user.email}
                                </Text>
<<<<<<< Updated upstream
=======
                                <Text size="sm" c="dimmed" maw={rem(680)} className="break-words">
                                    {user.bio || 'Your home base for profile details, saved recipes, favorites, and the recipes you are preserving.'}
                                </Text>
>>>>>>> Stashed changes
                            </Stack>
                        </div>

                        <div className="flex w-[8.25rem] shrink-0 flex-col gap-1.5 max-[430px]:w-9 md:w-auto md:flex-row md:justify-end">
                            <Tooltip label={primaryActionLabel} withArrow>
                                <Button
                                    component={Link}
                                    href={primaryActionHref}
                                    variant="filled"
                                    color="blue.5"
                                    size="sm"
                                    aria-label={primaryActionLabel}
                                    leftSection={<IconEdit size={16} />}
                                    className="h-9 w-full px-3 max-[430px]:w-9 max-[430px]:px-0 max-[430px]:[&_.mantine-Button-inner]:justify-center max-[430px]:[&_.mantine-Button-label]:hidden max-[430px]:[&_.mantine-Button-section]:m-0 md:w-auto"
                                >
                                    {primaryActionLabel}
                                </Button>
                            </Tooltip>
                            <CopyButton value={profileUrl} timeout={2000}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Copied!' : 'Share profile'} withArrow>
                                        <Button
                                            variant="light"
                                            color={copied ? 'teal' : 'accent'}
                                            onClick={copy}
                                            size="sm"
                                            aria-label={copied ? 'Copied profile link' : 'Share profile'}
                                            leftSection={copied ? <IconCheck size={16} /> : <IconShare size={16} />}
                                            className="h-9 w-full px-3 max-[430px]:w-9 max-[430px]:px-0 max-[430px]:[&_.mantine-Button-inner]:justify-center max-[430px]:[&_.mantine-Button-label]:hidden max-[430px]:[&_.mantine-Button-section]:m-0 md:w-auto"
                                        >
                                            {copied ? 'Copied' : 'Share'}
                                        </Button>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </div>

<<<<<<< Updated upstream
                        <Text size="sm" c="dimmed" className="col-span-2 leading-relaxed md:col-span-1 md:max-w-[42rem]">
=======
                    <Stack gap="sm" hiddenFrom="sm" className="min-w-0">
                        <div className="grid w-full min-w-0 grid-cols-[64px_minmax(0,1fr)_40px] gap-3">
                            <Avatar
                                src={user.profileImage}
                                size={62}
                                radius="md"
                                alt={user.name || 'User avatar'}
                                className="shrink-0"
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack gap={5} className="min-w-0">
                                <Group gap={6} wrap="wrap" className="min-w-0">
                                    <ThemeIcon variant="light" color="accent" radius="md" size="sm">
                                        <IconUserCircle size={15} />
                                    </ThemeIcon>
                                    {familyData && (
                                        <Badge leftSection={<IconUsers size={12} />} variant="light" color="accent" className="max-w-full">
                                            <span className="block max-w-[11rem] truncate">{familyData.name}</span>
                                        </Badge>
                                    )}
                                </Group>
                                <Text component="h1" fw={800} size="lg" className="truncate text-mainText">
                                    {user.name || 'Your Profile'}
                                </Text>
                                <Text size="sm" c="dimmed" className="truncate">
                                    {user.email}
                                </Text>
                            </Stack>

                            <Stack gap={6} align="flex-end" className="w-10">
                                <Tooltip label={primaryActionLabel} withArrow position="left">
                                    <ActionIcon
                                        component={Link}
                                        href={primaryActionHref}
                                        variant="filled"
                                        color="blue.5"
                                        size={36}
                                        radius="md"
                                        aria-label={primaryActionLabel}
                                    >
                                        <IconEdit size={17} />
                                    </ActionIcon>
                                </Tooltip>
                                <CopyButton value={profileUrl} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied!' : 'Share profile'} withArrow position="left">
                                            <ActionIcon
                                                variant="light"
                                                color={copied ? 'teal' : 'accent'}
                                                onClick={copy}
                                                size={36}
                                                radius="md"
                                                aria-label={copied ? 'Profile link copied' : 'Share profile'}
                                            >
                                                {copied ? <IconCheck size={17} /> : <IconShare size={17} />}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Stack>
                        </div>

                        <Text size="sm" c="dimmed" className="break-words">
>>>>>>> Stashed changes
                            {user.bio || 'Your home base for profile details, saved recipes, favorites, and the recipes you are preserving.'}
                        </Text>

                        {completion !== null && (
<<<<<<< Updated upstream
                            <Stack gap={4} className="col-span-2 w-full md:col-span-1 md:w-[260px] md:justify-self-end">
                                <Group justify="space-between" gap="xs">
                                    <Text size="xs" fw={500} c="dimmed">
                                        Profile completeness
                                    </Text>
                                    <Text size="xs" fw={700} c={completionColor}>
=======
                            <Stack gap={4} w="100%" className="min-w-0">
                                <Group justify="space-between" gap="xs" wrap="nowrap">
                                    <Text size="xs" fw={500} c="dimmed" className="truncate">
                                        Profile completeness
                                    </Text>
                                    <Text size="xs" fw={700} c={completionColor} className="shrink-0">
>>>>>>> Stashed changes
                                        {completion}%
                                    </Text>
                                </Group>
                                <Progress
                                    value={completion}
                                    color={completionColor}
                                    size="sm"
                                    radius="xl"
                                    animated={completion < 100}
                                />
                            </Stack>
                        )}
<<<<<<< Updated upstream
                    </div>
=======
                    </Stack>
>>>>>>> Stashed changes
                </Stack>
            </DashboardCard>
        </div>
    );
}

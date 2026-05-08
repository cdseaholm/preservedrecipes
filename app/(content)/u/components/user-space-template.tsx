'use client'

import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import {
    Avatar,
    Badge,
    Button,
    Card,
    CopyButton,
    Group,
    Progress,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    rem,
} from "@mantine/core";
import {
    IconCheck,
    IconEdit,
    IconShare,
    IconUserCircle,
    IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

export default function UserSpaceTemplate({
    children,
    user,
    familyData,
    completeness,
    primaryActionLabel = 'Edit Profile',
    primaryActionHref = '/u/profile?tab=settings',
}: {
    children: React.ReactNode;
    user: IUser;
    familyData?: IFamily | null;
    completeness?: number;
    primaryActionLabel?: string;
    primaryActionHref?: string;
}) {
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${user._id}/view`;
    const completion = completeness ?? null;
    const completionColor = completion === null ? 'gray' : completion >= 75 ? 'green' : completion >= 50 ? 'yellow' : 'red';

    useEffect(() => {
        setUserInfo(user);
    }, [setUserInfo, user]);

    return (
        <div className="flex min-h-[75dvh] w-full flex-col items-center justify-start px-2">
            <Card shadow="md" padding="xl" radius="md" withBorder w="100%" className="flex flex-1 flex-col">
                <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w="100%">
                    <Group justify="space-between" align="flex-start" gap="md">
                        <Group gap="md" align="flex-start" className="min-w-0">
                            <Avatar
                                src={user.profileImage}
                                size={72}
                                radius="md"
                                alt={user.name || 'User avatar'}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack gap={6} className="min-w-0">
                                <Group gap="xs">
                                    <ThemeIcon variant="light" color="accent" radius="md">
                                        <IconUserCircle size={18} />
                                    </ThemeIcon>
                                    {familyData && (
                                        <Badge leftSection={<IconUsers size={14} />} variant="light" color="accent">
                                            {familyData.name}
                                        </Badge>
                                    )}
                                </Group>
                                <Text component="h1" fw={800} size="xl" className="truncate text-mainText">
                                    {user.name || 'Your Profile'}
                                </Text>
                                <Text size="sm" c="dimmed" className="truncate">
                                    {user.email}
                                </Text>
                                <Text size="sm" c="dimmed" maw={rem(680)}>
                                    {user.bio || 'Your home base for profile details, saved recipes, favorites, and the recipes you are preserving.'}
                                </Text>
                            </Stack>
                        </Group>

                        <Stack gap="xs" align="flex-end">
                            <Group gap="xs" visibleFrom="sm">
                                <Button
                                    component={Link}
                                    href={primaryActionHref}
                                    variant="filled"
                                    color="blue.5"
                                    leftSection={<IconEdit size={16} />}
                                >
                                    {primaryActionLabel}
                                </Button>
                                <CopyButton value={profileUrl} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied!' : 'Share profile'} withArrow>
                                            <Button
                                                variant="light"
                                                color={copied ? 'teal' : 'accent'}
                                                onClick={copy}
                                                leftSection={copied ? <IconCheck size={16} /> : <IconShare size={16} />}
                                            >
                                                {copied ? 'Copied' : 'Share'}
                                            </Button>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Group>
                            {completion !== null && (
                                <Stack gap={4} w={{ base: '100%', sm: rem(260) }}>
                                    <Group justify="space-between" gap="xs">
                                        <Text size="xs" fw={500} c="dimmed">
                                            Profile completeness
                                        </Text>
                                        <Text size="xs" fw={700} c={completionColor}>
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
                        </Stack>
                    </Group>

                    <Group gap="xs" hiddenFrom="sm" grow>
                        <Button
                            component={Link}
                            href={primaryActionHref}
                            variant="filled"
                            color="blue.5"
                            leftSection={<IconEdit size={16} />}
                        >
                            {primaryActionLabel}
                        </Button>
                        <CopyButton value={profileUrl} timeout={2000}>
                            {({ copied, copy }) => (
                                <Button
                                    variant="light"
                                    color={copied ? 'teal' : 'accent'}
                                    onClick={copy}
                                    leftSection={copied ? <IconCheck size={16} /> : <IconShare size={16} />}
                                >
                                    {copied ? 'Copied' : 'Share'}
                                </Button>
                            )}
                        </CopyButton>
                    </Group>

                    <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w="100%">
                        {children}
                    </Stack>
                </Stack>
            </Card>
        </div>
    );
}

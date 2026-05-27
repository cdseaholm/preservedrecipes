'use client'

import { IUser } from "@/models/types/personal/user";
import { IFamily } from "@/models/types/family/family";
import { useRouter } from "next/navigation";

import {
    Card,
    Avatar,
    Text,
    Group,
    Button,
    Badge,
    Progress,
    Stack,
    ActionIcon,
    Tooltip,
    Box,
    CopyButton,
    rem
} from "@mantine/core";
import {
    IconEdit,
    IconShare,
    IconUsers,
    IconCheck,
} from "@tabler/icons-react";

interface ProfileHeaderProps {
    user: IUser;
    familyData: IFamily | null;
    completeness: number;
}

export default function ProfileHeader({ user, familyData, completeness }: ProfileHeaderProps) {
    const router = useRouter();
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/view/member/${user._id}`;
    const openSettings = () => router.push('/u/profile?tab=settings');

    const getCompletenessColor = () => {
        if (completeness >= 75) return 'green';
        if (completeness >= 50) return 'yellow';
        return 'red';
    };

    return (
        <Card shadow="md" padding="xl" radius="md" withBorder style={{
            minHeight: '28dvh'
        }}>
            <Stack gap="md">
                {/* Top Section */}
                <Group justify="space-between" wrap="nowrap">
                    {/* Avatar + Info */}
                    <Group gap="md" wrap="nowrap">
                        <Box pos="relative">
                            <Avatar
                                src={user.profileImage}
                                size={100}
                                radius="md"
                                alt={user.name || 'User avatar'}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Tooltip label="Edit profile picture">
                                <ActionIcon
                                    variant="filled"
                                    color="accent"
                                    radius="xl"
                                    size="sm"
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0
                                    }}
                                    onClick={openSettings}
                                >
                                    <IconEdit size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Box>

                        <Stack gap={4}>
                            <Text size="xl" fw={700}>
                                {user.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {user.email}
                            </Text>
                            {familyData && (
                                <Badge
                                    leftSection={<IconUsers size={14} />}
                                    variant="light"
                                    color="accent"
                                    size="md"
                                >
                                    {familyData.name}
                                </Badge>
                            )}
                        </Stack>
                    </Group>

                    {/* Action Buttons */}
                    <Group gap="xs" visibleFrom="sm">
                        <Button
                            variant='filled'
                            color="blue.5"
                            leftSection={<IconEdit size={16} />}
                            onClick={openSettings}
                            w={rem(150)}
                        >
                            Edit Profile
                        </Button>
                        <CopyButton value={profileUrl} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied!' : 'Share profile'} withArrow w={rem(150)}>
                                    <Button
                                        variant="light"
                                        color={copied ? 'teal' : 'accent'}
                                        onClick={copy}
                                        leftSection={copied ? <IconCheck size={16} /> : <IconShare size={16} />}
                                        w={rem(150)}
                                    >
                                        {copied ? 'Copied' : 'Share'}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Group>
                </Group>

                {/* Mobile Action Buttons */}
                <Group gap="xs" hiddenFrom="sm" grow>
                    <Button
                        variant='filled'
                        color="blue.5"
                        leftSection={<IconEdit size={16} />}
                        onClick={openSettings}
                    >
                        Edit
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

                {/* Bio */}
                {user.bio ? (
                    <Text size="sm" c="dimmed">
                        {user.bio}
                    </Text>
                ) : (
                    <Text
                        size="sm"
                        c="dimmed"
                        fs="italic"
                        onClick={openSettings}
                        style={{ cursor: 'pointer' }}
                        className="hover:text-accent transition-colors"
                    >
                        + Add a bio to tell others about yourself
                    </Text>
                )}

                {/* Profile Completeness */}
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text size="sm" fw={500}>
                            Profile Completeness
                        </Text>
                        <Text size="sm" fw={700} c={getCompletenessColor()}>
                            {completeness}%
                        </Text>
                    </Group>
                    <Progress
                        value={completeness}
                        color={getCompletenessColor()}
                        size="md"
                        radius="xl"
                        animated={completeness < 100}
                    />
                    {completeness < 100 && (
                        <Text
                            size="xs"
                            c="accent"
                            style={{ cursor: 'pointer' }}
                            onClick={openSettings}
                            className="hover:underline"
                        >
                            Complete your profile to unlock all features →
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
}

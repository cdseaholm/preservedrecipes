'use client'

import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconLogin2, IconLogout2, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { toast } from "sonner";

export default function UserSettingsTab({ isAdmin, community, userInfo }: { isAdmin: boolean, community: ICommunity, userInfo: IUser | null }) {
    const userId = userInfo?._id || '';
    const isMember = !!userId && (community.communityMemberIDs.includes(userId) || community.adminIDs.includes(userId) || community.creatorID === userId);

    const joinPublic = async () => {
        try {
            const response = await fetch('/api/community/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityID: community._id }),
            });
            const data = await response.json();
            if (!response.ok || data.status !== 200) {
                toast.error(data.message || 'Unable to join community');
                return;
            }
            toast.success('Joined community');
            window.location.reload();
        } catch {
            toast.error('Unable to join community');
        }
    };

    return (
        <Card withBorder radius="md" padding="lg" className="bg-secondaryBack">
            <Group justify="space-between" align="flex-start" gap="md">
                <Group gap="sm" align="flex-start" className="min-w-0">
                    <ThemeIcon variant="light" color={isAdmin ? 'blue' : 'accent'} radius="md" size="lg">
                        {isAdmin ? <IconShieldCheck size={20} /> : <IconUsers size={20} />}
                    </ThemeIcon>
                    <Stack gap={4} className="min-w-0">
                        <Text fw={800}>{isAdmin ? 'Community admin' : isMember ? 'Community member' : 'Join this community'}</Text>
                        <Text size="sm" c="dimmed">
                            {isAdmin
                                ? 'Admins can review requests and adjust community settings.'
                                : isMember
                                    ? 'You can post recipe discussions and share non-private recipes here.'
                                    : 'Join this public community before posting or sharing recipes.'}
                        </Text>
                    </Stack>
                </Group>

                <Group gap="xs">
                    {!isMember && community.privacyLevel === 'public' && (
                        <Button onClick={joinPublic} type="button" leftSection={<IconLogin2 size={16} />}>
                            Join Community
                        </Button>
                    )}
                    {isMember && !isAdmin && (
                        <Button onClick={() => toast.info('Leave community coming soon')} type="button" color="red" variant="light" leftSection={<IconLogout2 size={16} />}>
                            Leave Community
                        </Button>
                    )}
                </Group>
            </Group>
        </Card>
    );
}

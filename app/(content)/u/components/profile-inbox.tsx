'use client'

import { useState } from "react";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import InquiryTabContent from "./inquiry-tab";
import {
    Badge,
    Button,
    Card,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import { IconCheck, IconInbox, IconUserMinus, IconUsersGroup, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/context/userStore";

export type ProfileFamilyInvite = {
    email: string;
    inviteType?: 'family' | 'community';
    familyID: string;
    familyName: string;
    token: string;
    createdAt: Date | string;
};

export type ProfileCommunityInvite = {
    email: string;
    inviteType?: 'community';
    communityID: string;
    communityName: string;
    token: string;
    createdAt: Date | string;
};

type ProfileInboxProps = {
    familyInvites: ProfileFamilyInvite[];
    communityInvites: ProfileCommunityInvite[];
    initialInquiries: IInquiry[];
    user: IUser;
    isAdmin: boolean;
};

export default function ProfileInbox({ familyInvites, communityInvites, initialInquiries, user, isAdmin }: ProfileInboxProps) {
    const router = useRouter();
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const [familyInviteItems, setFamilyInviteItems] = useState(familyInvites);
    const [communityInviteItems, setCommunityInviteItems] = useState(communityInvites);
    const [busyToken, setBusyToken] = useState<string | null>(null);

    const handleAccept = async (invite: ProfileFamilyInvite) => {
        setBusyToken(invite.token);

        try {
            const response = await fetch('/api/invite/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: invite.token }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok || data?.status !== 200) {
                toast.error(data?.message || 'Failed to accept invite');
                return;
            }

            setFamilyInviteItems(current => current.filter(item => item.token !== invite.token));
            setUserInfo({ ...user, userFamilyID: invite.familyID });
            toast.success(`Joined ${invite.familyName}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to accept invite');
        } finally {
            setBusyToken(null);
        }
    };

    const handleDecline = async (invite: ProfileFamilyInvite) => {
        const confirmed = window.confirm(`Decline the invite to join ${invite.familyName}?`);
        if (!confirmed) return;

        setBusyToken(invite.token);

        try {
            const response = await fetch('/api/invite/decline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: invite.token }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok || data?.status !== 200) {
                toast.error(data?.message || 'Failed to decline invite');
                return;
            }

            setFamilyInviteItems(current => current.filter(item => item.token !== invite.token));
            toast.success('Invite declined');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to decline invite');
        } finally {
            setBusyToken(null);
        }
    };

    const handleAcceptCommunity = async (invite: ProfileCommunityInvite) => {
        setBusyToken(invite.token);

        try {
            const response = await fetch('/api/community/invite/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: invite.token }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok || data?.status !== 200) {
                toast.error(data?.message || 'Failed to accept invite');
                return;
            }

            setCommunityInviteItems(current => current.filter(item => item.token !== invite.token));
            setUserInfo({
                ...user,
                communityIDs: Array.from(new Set([...(user.communityIDs || []), invite.communityID])),
            });
            toast.success(data.message || `Joined ${invite.communityName}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to accept invite');
        } finally {
            setBusyToken(null);
        }
    };

    const handleDeclineCommunity = async (invite: ProfileCommunityInvite) => {
        const confirmed = window.confirm(`Decline the invite to join ${invite.communityName}?`);
        if (!confirmed) return;

        setBusyToken(invite.token);

        try {
            const response = await fetch('/api/community/invite/decline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: invite.token }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok || data?.status !== 200) {
                toast.error(data?.message || 'Failed to decline invite');
                return;
            }

            setCommunityInviteItems(current => current.filter(item => item.token !== invite.token));
            toast.success('Invite declined');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to decline invite');
        } finally {
            setBusyToken(null);
        }
    };

    const inviteCount = familyInviteItems.length + communityInviteItems.length;

    return (
        <Stack gap="xl">
            <Stack gap="md">
                <Group justify="space-between" align="flex-end" gap="sm">
                    <div>
                        <Text fw={700}>Invites</Text>
                        <Text size="sm" c="dimmed">
                            Invitations that need your attention.
                        </Text>
                    </div>
                    {inviteCount > 0 && (
                        <Badge variant="filled" color="red" circle>
                            {inviteCount}
                        </Badge>
                    )}
                </Group>

                {inviteCount > 0 ? (
                    <Stack gap="sm">
                        {familyInviteItems.map(invite => {
                            const alreadyInDifferentFamily = Boolean(user.userFamilyID && user.userFamilyID !== invite.familyID);

                            return (
                                <Card key={invite.token} withBorder radius="md" padding="md" className="bg-secondaryBack">
                                    <Group justify="space-between" align="flex-start" gap="md">
                                        <Group gap="sm" align="flex-start" className="min-w-0">
                                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                                <IconInbox size={18} />
                                            </div>
                                            <Stack gap={4} className="min-w-0">
                                                <Group gap="xs">
                                                    <Badge variant="light" color="accent">Family invite</Badge>
                                                    <Text size="xs" c="dimmed">
                                                        {new Date(invite.createdAt).toLocaleDateString()}
                                                    </Text>
                                                </Group>
                                                <Text fw={700} className="truncate">
                                                    {invite.familyName}
                                                </Text>
                                                <Text size="sm" c="dimmed">
                                                    You were invited to join this family.
                                                </Text>
                                                {alreadyInDifferentFamily && (
                                                    <Text size="sm" c="red">
                                                        You are already in a family. Leave your current family before accepting this invite.
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Group>

                                        <Group gap="xs" wrap="nowrap">
                                            {alreadyInDifferentFamily ? (
                                                <Button
                                                    component={Link}
                                                    href={`/family/${user.userFamilyID}/settings`}
                                                    variant="light"
                                                    color="red"
                                                    leftSection={<IconUserMinus size={16} />}
                                                >
                                                    Current family
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    loading={busyToken === invite.token}
                                                    disabled={busyToken !== null && busyToken !== invite.token}
                                                    onClick={() => handleAccept(invite)}
                                                    leftSection={<IconCheck size={16} />}
                                                >
                                                    Accept
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="subtle"
                                                color="gray"
                                                loading={busyToken === invite.token}
                                                disabled={busyToken !== null && busyToken !== invite.token}
                                                onClick={() => handleDecline(invite)}
                                                leftSection={<IconX size={16} />}
                                            >
                                                Decline
                                            </Button>
                                        </Group>
                                    </Group>
                                </Card>
                            );
                        })}
                        {communityInviteItems.map(invite => (
                            <Card key={invite.token} withBorder radius="md" padding="md" className="bg-secondaryBack">
                                <Group justify="space-between" align="flex-start" gap="md">
                                    <Group gap="sm" align="flex-start" className="min-w-0">
                                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                            <IconUsersGroup size={18} />
                                        </div>
                                        <Stack gap={4} className="min-w-0">
                                            <Group gap="xs">
                                                <Badge variant="light" color="blue">Community invite</Badge>
                                                <Text size="xs" c="dimmed">
                                                    {new Date(invite.createdAt).toLocaleDateString()}
                                                </Text>
                                            </Group>
                                            <Text fw={700} className="truncate">
                                                {invite.communityName}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                You were invited to join this community.
                                            </Text>
                                        </Stack>
                                    </Group>

                                    <Group gap="xs" wrap="nowrap">
                                        <Button
                                            type="button"
                                            loading={busyToken === invite.token}
                                            disabled={busyToken !== null && busyToken !== invite.token}
                                            onClick={() => handleAcceptCommunity(invite)}
                                            leftSection={<IconCheck size={16} />}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="subtle"
                                            color="gray"
                                            loading={busyToken === invite.token}
                                            disabled={busyToken !== null && busyToken !== invite.token}
                                            onClick={() => handleDeclineCommunity(invite)}
                                            leftSection={<IconX size={16} />}
                                        >
                                            Decline
                                        </Button>
                                    </Group>
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Card withBorder radius="md" padding="lg" className="bg-secondaryBack text-center">
                        <Text fw={700}>No pending invites</Text>
                        <Text size="sm" c="dimmed">Family and community invites will appear here when someone invites you.</Text>
                    </Card>
                )}
            </Stack>

            <InquiryTabContent
                initialInquiries={initialInquiries}
                user={user}
                isAdmin={isAdmin}
            />
        </Stack>
    );
}

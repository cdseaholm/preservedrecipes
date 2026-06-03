// ADMIN ONLY FOR THE COMMUNITY

'use client';

import { useCommunityStore } from "@/context/communityStore";
import { ICommunity } from "@/models/types/community/community";
import { AttemptDeleteCommunity } from "@/utils/apihelpers/delete/delete-community";
import { Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconEdit, IconLockCog, IconTrash } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import CommunityInviteForm from "./community-invite-form";

export default function CommunitySettings({ community, handleLoading }: { community: ICommunity, handleLoading: (loading: boolean) => void }) {
    const setEditCommunity = useCommunityStore(state => state.setEditCommunity);
    const communityID = community._id;

    const Delete = async () => {
        handleLoading(true);
        try {
            if (!communityID || communityID === '') {
                toast.error('Error: Invalid community data');
                handleLoading(false);
                return;
            }
            const attemptDelete = await AttemptDeleteCommunity(communityID);
            if (!attemptDelete.status) {
                toast.error(`Error: ${attemptDelete.message}`);
                handleLoading(false);
                return;
            }
            toast.success('Community deleted successfully.');
            window.location.href = '/communities';
        } catch (error) {
            toast.error('An unexpected error occurred while deleting the community.');
            handleLoading(false);
        }
    };

    const confirm = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this community? This action cannot be undone.');
        if (confirmed) {
            Delete();
        }
    };

    return (
        <Stack gap="md">
            <Group justify="space-between" align="flex-end" gap="sm">
                <div>
                    <Text fw={700}>Community settings</Text>
                    <Text size="sm" c="dimmed">Update core community details or remove the community.</Text>
                </div>
            </Group>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <SettingsAction
                    icon={<IconEdit size={18} />}
                    title="Community name"
                    description="Rename this community while keeping members, posts, and recipes intact."
                    action={<Button type="button" variant="light" onClick={() => setEditCommunity('edit-name')}>Change name</Button>}
                />
                <SettingsAction
                    icon={<IconLockCog size={18} />}
                    title="Privacy"
                    description="Adjust how people discover, join, or request access to this community."
                    action={<Button type="button" variant="light" onClick={() => setEditCommunity('edit-privacy-level')}>Change privacy</Button>}
                />
                <SettingsAction
                    icon={<IconTrash size={18} />}
                    title="Delete"
                    description="Permanently remove this community and return members to the community list."
                    danger
                    action={<Button type="button" color="red" variant="light" onClick={confirm}>Delete</Button>}
                />
            </div>

            <CommunityInviteForm community={community} />
        </Stack>
    );
}

function SettingsAction({ icon, title, description, action, danger = false }: { icon: ReactNode, title: string, description: string, action: ReactNode, danger?: boolean }) {
    return (
        <Card withBorder radius="md" padding="md" className="bg-secondaryBack">
            <Stack gap="sm" h="100%" justify="space-between">
                <Stack gap="sm">
                    <ThemeIcon variant="light" color={danger ? 'red' : 'accent'} radius="md">
                        {icon}
                    </ThemeIcon>
                    <div>
                        <Text fw={700}>{title}</Text>
                        <Text size="sm" c="dimmed">{description}</Text>
                    </div>
                </Stack>
                {action}
            </Stack>
        </Card>
    );
}

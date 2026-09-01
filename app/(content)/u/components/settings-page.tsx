'use client'

import { Alert, Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertTriangle, IconInfoCircle, IconMail, IconTrash, IconUser } from "@tabler/icons-react";
import AttemptDeleteUser from "@/utils/apihelpers/delete/deleteUser";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsTab() {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const resetDeleteModal = () => {
        setDeleteConfirmation('');
        setDeleteModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            toast.error('Type DELETE to confirm account deletion.');
            return;
        }

        setIsDeleting(true);
        const result = await AttemptDeleteUser({});

        if (!result.status) {
            setIsDeleting(false);
            return;
        }

        await signOut({ callbackUrl: '/' });
    };
    
    return (
        <>
            <Stack gap="md" className="rounded-md bg-secondaryBack p-4 sm:p-6">
                <div>
                    <h2 className="mb-1 text-2xl font-bold">Account Settings</h2>
                    <Text c="dimmed" size="sm">
                        Core profile editing is limited for the MVP. Account deletion is enabled so you can remove a test account when needed.
                    </Text>
                </div>

                <Alert icon={<IconInfoCircle size={18} />} color="yellow" variant="light">
                    Your recipes and family data are active. Password changes are not yet enabled in-app.
                </Alert>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput label="Display name" placeholder="Coming soon" leftSection={<IconUser size={16} />} disabled />
                    <TextInput label="Email" placeholder="Coming soon" leftSection={<IconMail size={16} />} disabled />
                </div>

                <Group justify="flex-start" className="min-w-0">
                    <Button type="button" variant="light" disabled>
                        Change password
                    </Button>
                    <Button
                        type="button"
                        variant="light"
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        Delete account
                    </Button>
                </Group>
            </Stack>

            <Modal
                opened={deleteModalOpen}
                onClose={isDeleting ? () => null : resetDeleteModal}
                title="Delete account"
                centered
            >
                <Stack gap="md">
                    <Alert icon={<IconAlertTriangle size={18} />} color="red" variant="light">
                        This permanently deletes your RecipeSafe account. If you are the only admin in a family, assign another admin before deleting your account.
                    </Alert>
                    <Text size="sm" c="dimmed">
                        Type DELETE to confirm.
                    </Text>
                    <TextInput
                        label="Confirmation"
                        value={deleteConfirmation}
                        onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
                        disabled={isDeleting}
                        autoComplete="off"
                    />
                    <Group justify="flex-end">
                        <Button type="button" variant="subtle" color="gray" onClick={resetDeleteModal} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            loading={isDeleting}
                            disabled={deleteConfirmation !== 'DELETE'}
                            onClick={handleDeleteAccount}
                        >
                            Delete account
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

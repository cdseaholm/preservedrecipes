'use client'

import { Alert, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { IconInfoCircle, IconMail, IconUser } from "@tabler/icons-react";

export default function SettingsTab() {
    
    return (
        <Stack gap="md" className="rounded-md bg-secondaryBack p-4 sm:p-6">
            <div>
                <h2 className="mb-1 text-2xl font-bold">Account Settings</h2>
                <Text c="dimmed" size="sm">
                    Core profile editing is limited for the MVP. These controls are intentionally disabled until the account edit flow is finished.
                </Text>
            </div>

            <Alert icon={<IconInfoCircle size={18} />} color="yellow" variant="light">
                Your profile, recipes, and family data are active. Password and account deletion tools are not yet enabled in-app.
            </Alert>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput label="Display name" placeholder="Coming soon" leftSection={<IconUser size={16} />} disabled />
                <TextInput label="Email" placeholder="Coming soon" leftSection={<IconMail size={16} />} disabled />
            </div>

            <Group justify="flex-start">
                <Button type="button" variant="light" disabled>
                    Change password
                </Button>
                <Button type="button" variant="light" color="red" disabled>
                    Delete account
                </Button>
            </Group>
        </Stack>
    );
}

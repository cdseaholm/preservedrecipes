'use client';

import { ICommunity } from "@/models/types/community/community";
import { Button, Card, Group, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconMailPlus, IconTrash } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function validateEmail(email: string) {
    const normalized = normalizeEmail(email);
    if (!normalized) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return 'Invalid email';
    return null;
}

export default function CommunityInviteForm({ community }: { community: ICommunity }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [queuedEmails, setQueuedEmails] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    const queueEmail = () => {
        const error = validateEmail(email);
        const normalized = normalizeEmail(email);

        if (error) {
            setEmailError(error);
            return;
        }

        if (queuedEmails.includes(normalized)) {
            setEmailError('Email already queued');
            return;
        }

        setQueuedEmails(current => [...current, normalized]);
        setEmail('');
        setEmailError(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let emails = queuedEmails;

        if (email.trim()) {
            const error = validateEmail(email);
            const normalized = normalizeEmail(email);
            if (error) {
                setEmailError(error);
                return;
            }
            emails = queuedEmails.includes(normalized) ? queuedEmails : [...queuedEmails, normalized];
        }

        if (emails.length <= 0) {
            setEmailError('Add at least one email');
            return;
        }

        setSending(true);
        try {
            const response = await fetch('/api/community/invite/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityID: community._id, emails }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok || data?.status !== 200) {
                toast.error(data?.message || 'Failed to send invites');
                return;
            }

            toast.success(data.message || 'Invites sent');
            setQueuedEmails([]);
            setEmail('');
            setEmailError(null);
        } catch {
            toast.error('Failed to send invites');
        } finally {
            setSending(false);
        }
    };

    return (
        <Card withBorder radius="md" padding="md" className="bg-secondaryBack">
            <form onSubmit={handleSubmit}>
                <Stack gap="sm">
                    <div>
                        <Text fw={700}>Invite members</Text>
                        <Text size="sm" c="dimmed">
                            Send private community invites by email.
                        </Text>
                    </div>
                    <Group gap="xs" align="flex-end" wrap="nowrap">
                        <TextInput
                            id="communityInviteEmail"
                            name="communityInviteEmail"
                            label="Email"
                            placeholder="person@example.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.currentTarget.value);
                                setEmailError(null);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    queueEmail();
                                }
                            }}
                            error={emailError}
                            className="min-w-0 flex-1"
                        />
                        <Button type="button" variant="light" onClick={queueEmail} leftSection={<IconMailPlus size={16} />}>
                            Add
                        </Button>
                    </Group>
                    <div className="min-h-[96px] rounded-md border border-accent/30 p-2">
                        <ScrollArea.Autosize mah={130} type="scroll">
                            {queuedEmails.length > 0 ? (
                                <Stack gap={4}>
                                    {queuedEmails.map((queuedEmail) => (
                                        <Group key={queuedEmail} justify="space-between" gap="sm" wrap="nowrap">
                                            <Text size="sm" className="truncate">{queuedEmail}</Text>
                                            <Button
                                                type="button"
                                                size="compact-xs"
                                                variant="subtle"
                                                color="red"
                                                aria-label={`Remove ${queuedEmail}`}
                                                onClick={() => setQueuedEmails(current => current.filter(item => item !== queuedEmail))}
                                            >
                                                <IconTrash size={14} />
                                            </Button>
                                        </Group>
                                    ))}
                                </Stack>
                            ) : (
                                <Text size="sm" c="dimmed" ta="center" pt="md">Queued invite emails will appear here.</Text>
                            )}
                        </ScrollArea.Autosize>
                    </div>
                    <Group justify="flex-end">
                        <Button type="submit" loading={sending} disabled={sending}>
                            Send invites
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Card>
    );
}

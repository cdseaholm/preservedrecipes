'use client'

import { useEffect, useMemo, useState } from "react";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { useInquiryActions } from "@/components/hooks/inquiry/inquiry-hooks";
import { formatShortDate } from "@/lib/data-normalization";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Checkbox,
    Group,
    Modal,
    Pagination,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    Textarea,
    Tooltip,
} from "@mantine/core";
import { IconArrowBackUp, IconCheck, IconInbox, IconMail, IconMailOpened, IconMessageCircle, IconPencil, IconSearch, IconTrash, IconUserMinus, IconUsersGroup, IconX } from "@tabler/icons-react";
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
    read?: boolean;
    createdAt: Date | string;
};

export type ProfileCommunityInvite = {
    email: string;
    inviteType?: 'community';
    communityID: string;
    communityName: string;
    token: string;
    read?: boolean;
    createdAt: Date | string;
};

type ProfileInboxProps = {
    familyInvites: ProfileFamilyInvite[];
    communityInvites: ProfileCommunityInvite[];
    initialInquiries: IInquiry[];
    user: IUser;
    isAdmin: boolean;
    onInboxCountChange?: (count: number) => void;
};

type InboxFilter = 'all' | 'invites' | 'inquiries';

type InboxInviteItem =
    | { kind: 'family-invite'; id: string; date: Date | string; invite: ProfileFamilyInvite }
    | { kind: 'community-invite'; id: string; date: Date | string; invite: ProfileCommunityInvite };

type InboxInquiryItem = {
    kind: 'inquiry';
    id: string;
    date: Date | string;
    inquiry: IInquiry;
};

type InboxItem = InboxInviteItem | InboxInquiryItem;

const ADMIN_INBOX_PAGE_SIZE = 4;
const MEMBER_INBOX_PAGE_SIZE = 4;

function getInquiryDisplayTitle(inquiry: IInquiry) {
    const formattedDate = formatShortDate(inquiry.createdAt);
    return formattedDate ? `${inquiry.inquiryType} ${formattedDate}` : inquiry.inquiryType;
}

function getMemberItemRead(item: InboxItem) {
    return item.kind === 'inquiry' ? Boolean(item.inquiry.read) : Boolean(item.invite.read);
}

export default function ProfileInbox({ familyInvites, communityInvites, initialInquiries, user, isAdmin, onInboxCountChange }: ProfileInboxProps) {
    const router = useRouter();
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const setInquiries = useUserStore(state => state.setInquiries);
    const { editInquiries, deleteInquiries, storedInquiries } = useInquiryActions();
    const [familyInviteItems, setFamilyInviteItems] = useState(familyInvites);
    const [communityInviteItems, setCommunityInviteItems] = useState(communityInvites);
    const [busyToken, setBusyToken] = useState<string | null>(null);
    const [busyInquiryId, setBusyInquiryId] = useState<string | null>(null);
    const [filter, setFilter] = useState<InboxFilter>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedInquiry, setSelectedInquiry] = useState<IInquiry | null>(null);
    const [selectedMemberItem, setSelectedMemberItem] = useState<InboxItem | null>(null);
    const [memberEditMode, setMemberEditMode] = useState(false);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [memberBulkBusy, setMemberBulkBusy] = useState(false);
    const [adminNoteDraft, setAdminNoteDraft] = useState('');

    useEffect(() => {
        setInquiries(initialInquiries);
    }, [initialInquiries, setInquiries]);

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

    const updateInviteRead = async (tokens: string[], read: boolean) => {
        if (tokens.length === 0) return true;

        const response = await fetch('/api/invite/edit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens, read }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || data?.status !== 200) {
            toast.error(data?.message || 'Failed to update invites');
            return false;
        }

        setFamilyInviteItems(current => current.map(invite => tokens.includes(invite.token) ? { ...invite, read } : invite));
        setCommunityInviteItems(current => current.map(invite => tokens.includes(invite.token) ? { ...invite, read } : invite));
        return true;
    };

    const deleteInviteItem = async (item: InboxInviteItem) => {
        const invite = item.invite;
        const response = await fetch(item.kind === 'family-invite' ? '/api/invite/decline' : '/api/community/invite/decline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: invite.token }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || data?.status !== 200) {
            toast.error(data?.message || 'Failed to delete invite');
            return false;
        }

        if (item.kind === 'family-invite') {
            setFamilyInviteItems(current => current.filter(currentInvite => currentInvite.token !== invite.token));
        } else {
            setCommunityInviteItems(current => current.filter(currentInvite => currentInvite.token !== invite.token));
        }

        return true;
    };

    const handleToggleHandled = async (inquiry: IInquiry, adminNote?: string) => {
        const updatedInquiry = { ...inquiry, adminNote: adminNote ?? inquiry.adminNote, handled: !inquiry.handled, updatedAt: new Date() };
        setBusyInquiryId(inquiry._id);
        await editInquiries([updatedInquiry]);
        setSelectedInquiry(current => current?._id === inquiry._id ? updatedInquiry : current);
        setBusyInquiryId(null);
    };

    const handleDeleteInquiry = async (inquiry: IInquiry) => {
        const confirmed = window.confirm('Delete this inquiry?');
        if (!confirmed) return;

        setBusyInquiryId(inquiry._id);
        await deleteInquiries([inquiry]);
        setSelectedInquiry(current => current?._id === inquiry._id ? null : current);
        setBusyInquiryId(null);
    };

    const updateMemberRead = async (items: InboxItem[], read: boolean) => {
        setMemberBulkBusy(true);
        try {
            const inquiries = items
                .filter((item): item is InboxInquiryItem => item.kind === 'inquiry')
                .map(item => ({ ...item.inquiry, read, updatedAt: new Date() }));
            const inviteTokens = items
                .filter((item): item is InboxInviteItem => item.kind !== 'inquiry')
                .map(item => item.invite.token);

            if (inquiries.length > 0) {
                const result = await editInquiries(inquiries);
                if (!result.success) return false;
            }

            const invitesUpdated = await updateInviteRead(inviteTokens, read);
            if (!invitesUpdated) return false;

            const updatedIds = new Set(items.map(item => item.id));
            setSelectedMemberItem(current => {
                if (!current || !updatedIds.has(current.id)) return current;

                if (current.kind === 'inquiry') {
                    return { ...current, inquiry: { ...current.inquiry, read, updatedAt: new Date() } };
                }

                return { ...current, invite: { ...current.invite, read } } as InboxItem;
            });
            toast.success(read ? 'Marked as read' : 'Marked as unread');
            return true;
        } finally {
            setMemberBulkBusy(false);
        }
    };

    const deleteMemberItems = async (items: InboxItem[]) => {
        if (items.length === 0) return;

        const confirmed = window.confirm(items.length === 1 ? 'Delete this message?' : `Delete ${items.length} messages?`);
        if (!confirmed) return;

        setMemberBulkBusy(true);
        try {
            const inquiries = items
                .filter((item): item is InboxInquiryItem => item.kind === 'inquiry')
                .map(item => item.inquiry);
            const invites = items.filter((item): item is InboxInviteItem => item.kind !== 'inquiry');

            if (inquiries.length > 0) {
                const result = await deleteInquiries(inquiries);
                if (!result.success) return;
            }

            for (const invite of invites) {
                const deleted = await deleteInviteItem(invite);
                if (!deleted) return;
            }

            const deletedIds = new Set(items.map(item => item.id));
            setSelectedMemberIds(current => current.filter(id => !deletedIds.has(id)));
            setSelectedMemberItem(current => current && deletedIds.has(current.id) ? null : current);
            toast.success(items.length === 1 ? 'Message deleted' : 'Messages deleted');
            router.refresh();
        } finally {
            setMemberBulkBusy(false);
        }
    };

    const handleSaveAdminNote = async () => {
        if (!selectedInquiry) return;

        const updatedInquiry = { ...selectedInquiry, adminNote: adminNoteDraft, updatedAt: new Date() };
        setBusyInquiryId(selectedInquiry._id);
        await editInquiries([updatedInquiry]);
        setSelectedInquiry(updatedInquiry);
        setBusyInquiryId(null);
    };

    const inviteItems: InboxInviteItem[] = useMemo(() => [
        ...familyInviteItems.map(invite => ({ kind: 'family-invite' as const, id: invite.token, date: invite.createdAt, invite })),
        ...communityInviteItems.map(invite => ({ kind: 'community-invite' as const, id: invite.token, date: invite.createdAt, invite })),
    ], [familyInviteItems, communityInviteItems]);

    const inquiryItems: InboxInquiryItem[] = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        return storedInquiries
            .filter((inquiry) => {
                if (!normalizedSearch) return true;

                return [
                    inquiry.inquiryTitle,
                    inquiry.inquiryType,
                    inquiry.inquiryMessage,
                    inquiry.inquirerName,
                    inquiry.inquirerEmail,
                ].some(value => value?.toLowerCase().includes(normalizedSearch));
            })
            .map(inquiry => ({ kind: 'inquiry' as const, id: inquiry._id, date: inquiry.createdAt, inquiry }));
    }, [search, storedInquiries]);

    const inboxItems = useMemo(() => {
        const items: InboxItem[] = [
            ...(filter !== 'inquiries' ? inviteItems : []),
            ...(filter !== 'invites' ? inquiryItems : []),
        ];

        return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [filter, inquiryItems, inviteItems]);

    const totalPages = Math.max(1, Math.ceil(inboxItems.length / ADMIN_INBOX_PAGE_SIZE));
    const visibleInboxItems = inboxItems.slice((page - 1) * ADMIN_INBOX_PAGE_SIZE, page * ADMIN_INBOX_PAGE_SIZE);
    const memberInboxItems: InboxItem[] = useMemo(() => [...inviteItems, ...inquiryItems]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [inquiryItems, inviteItems]);
    const memberPages = Math.max(1, Math.ceil(memberInboxItems.length / MEMBER_INBOX_PAGE_SIZE));
    const visibleMemberInboxItems = memberInboxItems.slice((page - 1) * MEMBER_INBOX_PAGE_SIZE, page * MEMBER_INBOX_PAGE_SIZE);
    const selectedMemberItems = useMemo(
        () => memberInboxItems.filter(item => selectedMemberIds.includes(item.id)),
        [memberInboxItems, selectedMemberIds]
    );
    const visibleMemberIds = useMemo(() => visibleMemberInboxItems.map(item => item.id), [visibleMemberInboxItems]);
    const allVisibleSelected = visibleMemberIds.length > 0 && visibleMemberIds.every(id => selectedMemberIds.includes(id));
    const inviteCount = inviteItems.length;
    const openInquiryCount = storedInquiries.filter(inquiry => !inquiry.handled).length;
    const unreadMemberCount = memberInboxItems.filter(item => !getMemberItemRead(item)).length;

    useEffect(() => {
        setPage(1);
    }, [filter, search]);

    useEffect(() => {
        const pageCount = isAdmin ? totalPages : memberPages;
        setPage(currentPage => Math.min(currentPage, pageCount));
    }, [isAdmin, memberPages, totalPages]);

    useEffect(() => {
        setAdminNoteDraft(selectedInquiry?.adminNote || '');
    }, [selectedInquiry]);

    useEffect(() => {
        setSelectedMemberIds(current => current.filter(id => memberInboxItems.some(item => item.id === id)));
    }, [memberInboxItems]);

    useEffect(() => {
        onInboxCountChange?.(isAdmin ? openInquiryCount : unreadMemberCount);
    }, [isAdmin, onInboxCountChange, openInquiryCount, unreadMemberCount]);

    const toggleMemberSelection = (id: string) => {
        setSelectedMemberIds(current => current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id]);
    };

    const toggleVisibleMemberSelection = () => {
        setSelectedMemberIds(current => {
            if (allVisibleSelected) return current.filter(id => !visibleMemberIds.includes(id));
            return Array.from(new Set([...current, ...visibleMemberIds]));
        });
    };

    const renderInviteCard = (item: InboxInviteItem) => {
        if (item.kind === 'family-invite') {
            const invite = item.invite;
            const alreadyInDifferentFamily = Boolean(user.userFamilyID && user.userFamilyID !== invite.familyID);

            return (
                <Card key={item.id} withBorder radius="md" padding="sm" className="bg-secondaryBack">
                    <Group justify="space-between" align="flex-start" gap="md" className="min-w-0">
                        <Group gap="sm" align="flex-start" className="min-w-0 flex-1">
                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <IconInbox size={18} />
                            </div>
                            <Stack gap={4} className="min-w-0">
                                <Group gap="xs" wrap="wrap">
                                    <Badge variant="light" color="accent">Family invite</Badge>
                                    <Text size="xs" c="dimmed">{new Date(invite.createdAt).toLocaleDateString()}</Text>
                                </Group>
                                <Text fw={700} className="truncate">{invite.familyName}</Text>
                                <Text size="sm" c="dimmed" lineClamp={1}>You were invited to join this family.</Text>
                                {alreadyInDifferentFamily && (
                                    <Text size="sm" c="red" lineClamp={1}>
                                        You are already in a family. Leave your current family before accepting.
                                    </Text>
                                )}
                            </Stack>
                        </Group>

                        <Group gap="xs" wrap="wrap" className="w-full sm:w-auto">
                            {alreadyInDifferentFamily ? (
                                <Button component={Link} href={`/family/${user.userFamilyID}/settings`} variant="light" color="red" leftSection={<IconUserMinus size={16} />} className="flex-1 sm:flex-none">
                                    Current family
                                </Button>
                            ) : (
                                <Button type="button" loading={busyToken === invite.token} disabled={busyToken !== null && busyToken !== invite.token} onClick={() => handleAccept(invite)} leftSection={<IconCheck size={16} />} className="flex-1 sm:flex-none">
                                    Accept
                                </Button>
                            )}
                            <Button type="button" variant="subtle" color="gray" loading={busyToken === invite.token} disabled={busyToken !== null && busyToken !== invite.token} onClick={() => handleDecline(invite)} leftSection={<IconX size={16} />} className="flex-1 sm:flex-none">
                                Decline
                            </Button>
                        </Group>
                    </Group>
                </Card>
            );
        }

        const invite = item.invite;

        return (
            <Card key={item.id} withBorder radius="md" padding="sm" className="bg-secondaryBack">
                <Group justify="space-between" align="flex-start" gap="md" className="min-w-0">
                    <Group gap="sm" align="flex-start" className="min-w-0 flex-1">
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <IconUsersGroup size={18} />
                        </div>
                        <Stack gap={4} className="min-w-0">
                            <Group gap="xs" wrap="wrap">
                                <Badge variant="light" color="blue">Community invite</Badge>
                                <Text size="xs" c="dimmed">{new Date(invite.createdAt).toLocaleDateString()}</Text>
                            </Group>
                            <Text fw={700} className="truncate">{invite.communityName}</Text>
                            <Text size="sm" c="dimmed" lineClamp={1}>You were invited to join this community.</Text>
                        </Stack>
                    </Group>

                    <Group gap="xs" wrap="wrap" className="w-full sm:w-auto">
                        <Button type="button" loading={busyToken === invite.token} disabled={busyToken !== null && busyToken !== invite.token} onClick={() => handleAcceptCommunity(invite)} leftSection={<IconCheck size={16} />} className="flex-1 sm:flex-none">
                            Accept
                        </Button>
                        <Button type="button" variant="subtle" color="gray" loading={busyToken === invite.token} disabled={busyToken !== null && busyToken !== invite.token} onClick={() => handleDeclineCommunity(invite)} leftSection={<IconX size={16} />} className="flex-1 sm:flex-none">
                            Decline
                        </Button>
                    </Group>
                </Group>
            </Card>
        );
    };

    const renderInquiryCard = (item: InboxInquiryItem) => {
        const inquiry = item.inquiry;
        const statusLabel = inquiry.handled ? 'Feedback closed' : 'Feedback received';

        return (
            <Card
                key={item.id}
                withBorder
                radius="md"
                padding={0}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedInquiry(inquiry)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedInquiry(inquiry);
                    }
                }}
                className="w-full cursor-pointer overflow-hidden bg-mainBack/60 text-left transition hover:border-accent/30 hover:bg-cardBack/80"
            >
                <Group justify="space-between" align="center" gap="xs" wrap="nowrap" className="min-h-[clamp(4.25rem,7.5vw,5rem)] px-2.5 py-2 sm:px-3">
                    <Group gap="sm" align="center" wrap="nowrap" className="min-w-0 flex-1">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent max-[520px]:size-8">
                            <IconMessageCircle size={17} />
                        </div>
                        <Stack gap={4} className="min-w-0">
                            <Text fw={800} title={isAdmin ? getInquiryDisplayTitle(inquiry) : statusLabel} className="truncate text-[clamp(0.88rem,1.8vw,1rem)] leading-tight text-mainText">
                                {isAdmin ? getInquiryDisplayTitle(inquiry) : statusLabel}
                            </Text>
                            {!isAdmin && (
                                <Text size="xs" c="dimmed" className="truncate">
                                    {getInquiryDisplayTitle(inquiry)}
                                </Text>
                            )}
                        </Stack>
                    </Group>

                    <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
                        <Badge variant="light" color={inquiry.handled ? 'green' : 'yellow'}>
                            {inquiry.handled ? 'Handled' : 'Open'}
                        </Badge>
                        {isAdmin && (
                            <>
                                <Tooltip label={inquiry.handled ? 'Reopen ticket' : 'Close ticket'}>
                                    <ActionIcon type="button" variant="light" color={inquiry.handled ? 'gray' : 'green'} onClick={() => handleToggleHandled(inquiry)} loading={busyInquiryId === inquiry._id} disabled={busyInquiryId !== null && busyInquiryId !== inquiry._id} aria-label={inquiry.handled ? 'Reopen ticket' : 'Close ticket'}>
                                        {inquiry.handled ? <IconArrowBackUp size={16} /> : <IconCheck size={16} />}
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete">
                                    <ActionIcon type="button" variant="light" color="red" onClick={() => handleDeleteInquiry(inquiry)} loading={busyInquiryId === inquiry._id} disabled={busyInquiryId !== null && busyInquiryId !== inquiry._id} aria-label="Delete inquiry">
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </>
                        )}
                    </Group>
                </Group>
            </Card>
        );
    };

    const getMemberItemTitle = (item: InboxItem) => {
        if (item.kind === 'inquiry') return item.inquiry.handled ? 'Feedback closed' : 'Feedback received';
        if (item.kind === 'family-invite') return `Family invite: ${item.invite.familyName}`;
        return `Community invite: ${item.invite.communityName}`;
    };

    const getMemberItemSubtitle = (item: InboxItem) => {
        if (item.kind === 'inquiry') return getInquiryDisplayTitle(item.inquiry);
        return formatShortDate(item.date);
    };

    const renderMemberMessageCard = (item: InboxItem) => {
        const isRead = getMemberItemRead(item);
        const isSelected = selectedMemberIds.includes(item.id);
        const icon = item.kind === 'family-invite'
            ? <IconInbox size={17} />
            : item.kind === 'community-invite'
                ? <IconUsersGroup size={17} />
                : <IconMessageCircle size={17} />;

        return (
            <Card
                key={item.id}
                withBorder
                radius="md"
                padding={0}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMemberItem(item)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedMemberItem(item);
                    }
                }}
                className="w-full cursor-pointer overflow-hidden bg-mainBack/60 text-left transition hover:border-accent/30 hover:bg-cardBack/80"
            >
                <Group justify="space-between" align="center" gap="xs" wrap="nowrap" className="min-h-[clamp(4.25rem,7.5vw,5rem)] px-2.5 py-2 sm:px-3">
                    <Group gap="sm" align="center" wrap="nowrap" className="min-w-0 flex-1">
                        {memberEditMode && (
                            <Checkbox
                                checked={isSelected}
                                onChange={() => toggleMemberSelection(item.id)}
                                onClick={(event) => event.stopPropagation()}
                                aria-label={`Select ${getMemberItemTitle(item)}`}
                            />
                        )}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent max-[520px]:size-8">
                            {icon}
                        </div>
                        <Stack gap={3} className="min-w-0">
                            <Group gap="xs" wrap="nowrap" className="min-w-0">
                                {!isRead && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                                <Text fw={800} title={getMemberItemTitle(item)} className="truncate text-[clamp(0.88rem,1.8vw,1rem)] leading-tight text-mainText">
                                    {getMemberItemTitle(item)}
                                </Text>
                            </Group>
                            <Text size="xs" c="dimmed" className="truncate">
                                {getMemberItemSubtitle(item)}
                            </Text>
                        </Stack>
                    </Group>

                    <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
                        {!isRead && (
                            <Badge variant="light" color="accent" className="hidden min-[430px]:inline-flex">
                                Unread
                            </Badge>
                        )}
                        <Tooltip label={isRead ? 'Mark unread' : 'Mark read'}>
                            <ActionIcon
                                type="button"
                                variant="light"
                                color={isRead ? 'gray' : 'green'}
                                onClick={() => updateMemberRead([item], !isRead)}
                                loading={memberBulkBusy}
                                aria-label={isRead ? 'Mark unread' : 'Mark read'}
                            >
                                {isRead ? <IconMail size={16} /> : <IconMailOpened size={16} />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete">
                            <ActionIcon
                                type="button"
                                variant="light"
                                color="red"
                                onClick={() => deleteMemberItems([item])}
                                loading={memberBulkBusy}
                                aria-label="Delete message"
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </Card>
        );
    };

    if (!isAdmin) {
        return (
            <>
                <Stack gap="sm" className="h-full min-h-0">
                    <Group justify="space-between" align="flex-end" gap="sm" wrap="nowrap">
                        <div className="min-w-0">
                            <Text fw={700}>Inbox</Text>
                            <Text size="sm" c="dimmed" lineClamp={1}>Messages about invites and feedback updates.</Text>
                        </div>
                        <Group gap="xs" wrap="nowrap">
                            {unreadMemberCount > 0 && (
                                <Badge variant="filled" color="red" circle>
                                    {unreadMemberCount}
                                </Badge>
                            )}
                            {memberInboxItems.length > 0 && (
                                <Button
                                    type="button"
                                    size="xs"
                                    variant={memberEditMode ? 'filled' : 'light'}
                                    leftSection={<IconPencil size={14} />}
                                    onClick={() => {
                                        setMemberEditMode(current => !current);
                                        setSelectedMemberIds([]);
                                    }}
                                >
                                    {memberEditMode ? 'Done' : 'Edit'}
                                </Button>
                            )}
                        </Group>
                    </Group>

                    {memberEditMode && (
                        <Group gap="xs" wrap="wrap" className="shrink-0">
                            <Button type="button" size="xs" variant="light" onClick={toggleVisibleMemberSelection}>
                                {allVisibleSelected ? 'Clear page' : 'Select page'}
                            </Button>
                            <Button type="button" size="xs" variant="light" disabled={selectedMemberItems.length === 0 || memberBulkBusy} onClick={() => updateMemberRead(selectedMemberItems, true)}>
                                Mark read
                            </Button>
                            <Button type="button" size="xs" variant="light" disabled={selectedMemberItems.length === 0 || memberBulkBusy} onClick={() => updateMemberRead(selectedMemberItems, false)}>
                                Mark unread
                            </Button>
                            <Button type="button" size="xs" variant="light" color="red" disabled={selectedMemberItems.length === 0 || memberBulkBusy} onClick={() => deleteMemberItems(selectedMemberItems)}>
                                Delete selected
                            </Button>
                        </Group>
                    )}

                    <Stack gap="sm" className="min-h-0 flex-1 overflow-hidden">
                        {visibleMemberInboxItems.length > 0 ? (
                            visibleMemberInboxItems.map(renderMemberMessageCard)
                        ) : (
                            <Card withBorder radius="md" padding="md" className="flex flex-1 items-center justify-center bg-secondaryBack text-center">
                                <div>
                                    <Text fw={700}>No messages</Text>
                                    <Text size="sm" c="dimmed">New invites and feedback updates will appear here.</Text>
                                </div>
                            </Card>
                        )}
                    </Stack>

                    {memberInboxItems.length > MEMBER_INBOX_PAGE_SIZE && (
                            <Group justify="center" className="shrink-0">
                                <Pagination total={memberPages} value={page} onChange={setPage} size="xs" />
                            </Group>
                    )}
                </Stack>

                <MemberMessageModal
                    selectedItem={selectedMemberItem}
                    setSelectedItem={setSelectedMemberItem}
                    user={user}
                    busy={memberBulkBusy}
                    markRead={(item, read) => updateMemberRead([item], read)}
                    deleteItem={(item) => deleteMemberItems([item])}
                    acceptFamily={handleAccept}
                    acceptCommunity={handleAcceptCommunity}
                />
            </>
        );
    }

    return (
        <>
            <Stack gap="sm" className="h-full min-w-0 overflow-hidden">
                <Group justify="space-between" align="flex-end" gap="sm" wrap="wrap" className="shrink-0">
                    <div className="min-w-0">
                        <Text fw={700}>Inbox</Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            Invites and site feedback in one queue.
                        </Text>
                    </div>
                    <Group gap="xs" wrap="wrap">
                        <Badge variant="light" color="red">{inviteCount} invites</Badge>
                        <Badge variant="light" color="accent">{openInquiryCount} open</Badge>
                    </Group>
                </Group>

                <Group gap="sm" wrap="nowrap" className="shrink-0">
                    <SegmentedControl
                        value={filter}
                        onChange={(value) => setFilter(value as InboxFilter)}
                        data={[
                            { label: 'All', value: 'all' },
                            { label: 'Invites', value: 'invites' },
                            { label: 'Inquiries', value: 'inquiries' },
                        ]}
                        className="shrink-0"
                        size="xs"
                    />
                    <TextInput
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                        placeholder="Search inquiries"
                        leftSection={<IconSearch size={16} />}
                        className="min-w-0 flex-1"
                        disabled={filter === 'invites'}
                    />
                </Group>

            <Stack gap="sm" className="min-h-0 overflow-hidden">
                {visibleInboxItems.length > 0 ? (
                    visibleInboxItems.map(item => item.kind === 'inquiry' ? renderInquiryCard(item) : renderInviteCard(item))
                ) : (
                        <Card withBorder radius="md" padding="xl" className="flex flex-1 items-center justify-center bg-secondaryBack text-center">
                            <div>
                                <Text fw={700}>Inbox is clear</Text>
                                <Text size="sm" c="dimmed">No items match this view.</Text>
                            </div>
                        </Card>
                    )}
                </Stack>

                {inboxItems.length > ADMIN_INBOX_PAGE_SIZE && (
                    <Group justify="center" className="shrink-0">
                        <Pagination total={totalPages} value={page} onChange={setPage} size="xs" withEdges />
                    </Group>
                )}
            </Stack>

            <InquiryDetailsModal
                selectedInquiry={selectedInquiry}
                setSelectedInquiry={setSelectedInquiry}
                isAdmin
                adminNoteDraft={adminNoteDraft}
                setAdminNoteDraft={setAdminNoteDraft}
                busyInquiryId={busyInquiryId}
                handleToggleHandled={handleToggleHandled}
                handleDeleteInquiry={handleDeleteInquiry}
                handleSaveAdminNote={handleSaveAdminNote}
            />
        </>
    );
}

function MemberMessageModal({
    selectedItem,
    setSelectedItem,
    user,
    busy,
    markRead,
    deleteItem,
    acceptFamily,
    acceptCommunity,
}: {
    selectedItem: InboxItem | null;
    setSelectedItem: (item: InboxItem | null) => void;
    user: IUser;
    busy: boolean;
    markRead: (item: InboxItem, read: boolean) => Promise<boolean>;
    deleteItem: (item: InboxItem) => Promise<void>;
    acceptFamily: (invite: ProfileFamilyInvite) => Promise<void>;
    acceptCommunity: (invite: ProfileCommunityInvite) => Promise<void>;
}) {
    const isRead = selectedItem
        ? selectedItem.kind === 'inquiry'
            ? Boolean(selectedItem.inquiry.read)
            : Boolean(selectedItem.invite.read)
        : false;
    const title = selectedItem
        ? selectedItem.kind === 'inquiry'
            ? selectedItem.inquiry.handled ? 'Feedback closed' : 'Feedback received'
            : selectedItem.kind === 'family-invite'
                ? `Family invite: ${selectedItem.invite.familyName}`
                : `Community invite: ${selectedItem.invite.communityName}`
        : 'Message';

    const handleDelete = async () => {
        if (!selectedItem) return;

        await deleteItem(selectedItem);
        setSelectedItem(null);
    };

    return (
        <Modal
            opened={selectedItem !== null}
            onClose={() => setSelectedItem(null)}
            title={title}
            centered
            size="lg"
        >
            {selectedItem && (
                <Stack gap="md">
                    <Group gap="xs" wrap="wrap">
                        <Badge variant="light" color={isRead ? 'gray' : 'accent'}>
                            {isRead ? 'Read' : 'Unread'}
                        </Badge>
                        {selectedItem.kind === 'inquiry' ? (
                            <>
                                <Badge variant="light" color={selectedItem.inquiry.handled ? 'green' : 'yellow'}>
                                    {selectedItem.inquiry.handled ? 'Feedback closed' : 'Feedback received'}
                                </Badge>
                                <Badge variant="outline" color="accent">{selectedItem.inquiry.inquiryType}</Badge>
                                <Badge variant="light" color="gray">{formatShortDate(selectedItem.inquiry.createdAt)}</Badge>
                            </>
                        ) : (
                            <>
                                <Badge variant="outline" color="accent">
                                    {selectedItem.kind === 'family-invite' ? 'Family invite' : 'Community invite'}
                                </Badge>
                                <Badge variant="light" color="gray">{formatShortDate(selectedItem.date)}</Badge>
                            </>
                        )}
                    </Group>

                    {selectedItem.kind === 'inquiry' ? (
                        <>
                            <Stack gap={2}>
                                <Text size="sm" fw={700}>Subject</Text>
                                <Text size="sm" className="break-words">{getInquiryDisplayTitle(selectedItem.inquiry)}</Text>
                            </Stack>
                            <Stack gap={2}>
                                <Text size="sm" fw={700}>Message</Text>
                                <Text size="sm" className="whitespace-pre-wrap break-words">
                                    {selectedItem.inquiry.inquiryMessage}
                                </Text>
                            </Stack>
                            <Stack gap={2}>
                                <Text size="sm" fw={700}>Admin note</Text>
                                <Text size="sm" c={selectedItem.inquiry.adminNote ? undefined : 'dimmed'} className="whitespace-pre-wrap break-words">
                                    {selectedItem.inquiry.adminNote || 'No note yet.'}
                                </Text>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Stack gap={2}>
                                <Text size="sm" fw={700}>
                                    {selectedItem.kind === 'family-invite' ? 'Family' : 'Community'}
                                </Text>
                                <Text size="sm" className="break-words">
                                    {selectedItem.kind === 'family-invite' ? selectedItem.invite.familyName : selectedItem.invite.communityName}
                                </Text>
                            </Stack>
                            <Text size="sm" c="dimmed">
                                You were invited to join this {selectedItem.kind === 'family-invite' ? 'family' : 'community'}.
                            </Text>
                        </>
                    )}

                    <Group justify="flex-end" gap="sm" wrap="wrap">
                        <Button
                            type="button"
                            variant="light"
                            color={isRead ? 'gray' : 'green'}
                            leftSection={isRead ? <IconMail size={16} /> : <IconMailOpened size={16} />}
                            loading={busy}
                            onClick={() => markRead(selectedItem, !isRead)}
                        >
                            {isRead ? 'Mark unread' : 'Mark read'}
                        </Button>
                        {selectedItem.kind === 'family-invite' && (
                            user.userFamilyID && user.userFamilyID !== selectedItem.invite.familyID ? (
                                <Button component={Link} href={`/family/${user.userFamilyID}/settings`} variant="light" color="red" leftSection={<IconUserMinus size={16} />}>
                                    Current family
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    leftSection={<IconCheck size={16} />}
                                    onClick={() => acceptFamily(selectedItem.invite)}
                                >
                                    Accept
                                </Button>
                            )
                        )}
                        {selectedItem.kind === 'community-invite' && (
                            <Button
                                type="button"
                                leftSection={<IconCheck size={16} />}
                                onClick={() => acceptCommunity(selectedItem.invite)}
                            >
                                Accept
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="light"
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            loading={busy}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}

function InquiryDetailsModal({
    selectedInquiry,
    setSelectedInquiry,
    isAdmin,
    adminNoteDraft = '',
    setAdminNoteDraft,
    busyInquiryId,
    handleToggleHandled,
    handleDeleteInquiry,
    handleSaveAdminNote,
}: {
    selectedInquiry: IInquiry | null;
    setSelectedInquiry: (inquiry: IInquiry | null) => void;
    isAdmin: boolean;
    adminNoteDraft?: string;
    setAdminNoteDraft?: (note: string) => void;
    busyInquiryId?: string | null;
    handleToggleHandled?: (inquiry: IInquiry, adminNote?: string) => void;
    handleDeleteInquiry?: (inquiry: IInquiry) => void;
    handleSaveAdminNote?: () => void;
}) {
    return (
        <Modal
            opened={selectedInquiry !== null}
            onClose={() => setSelectedInquiry(null)}
            title={selectedInquiry ? getInquiryDisplayTitle(selectedInquiry) : 'Inquiry'}
            centered
            size="lg"
        >
            {selectedInquiry && (
                <Stack gap="md">
                    <Group gap="xs" wrap="wrap">
                        <Badge variant="light" color={selectedInquiry.handled ? 'green' : 'yellow'}>
                            {isAdmin
                                ? selectedInquiry.handled ? 'Handled' : 'Open'
                                : selectedInquiry.handled ? 'Feedback closed' : 'Feedback received'}
                        </Badge>
                        <Badge variant="outline" color="accent">{selectedInquiry.inquiryType}</Badge>
                        <Badge variant="light" color="gray">{formatShortDate(selectedInquiry.createdAt)}</Badge>
                    </Group>
                    <Stack gap={2}>
                        <Text size="sm" fw={700}>From</Text>
                        <Text size="sm" c="dimmed" className="break-words">
                            {selectedInquiry.inquirerName} - {selectedInquiry.inquirerEmail}
                        </Text>
                    </Stack>
                    <Stack gap={2}>
                        <Text size="sm" fw={700}>Message</Text>
                        <Text size="sm" className="whitespace-pre-wrap break-words">
                            {selectedInquiry.inquiryMessage}
                        </Text>
                    </Stack>
                    {isAdmin ? (
                        <>
                            <Textarea
                                label="Note to sender"
                                placeholder="Add a note they can see in their inbox"
                                value={adminNoteDraft}
                                onChange={(event) => setAdminNoteDraft?.(event.currentTarget.value)}
                                autosize
                                minRows={3}
                            />
                            <Group justify="flex-end" gap="sm">
                                <Button
                                    type="button"
                                    variant="light"
                                    onClick={handleSaveAdminNote}
                                    loading={busyInquiryId === selectedInquiry._id}
                                    disabled={busyInquiryId !== null && busyInquiryId !== selectedInquiry._id}
                                >
                                    Save note
                                </Button>
                                <Button
                                    type="button"
                                    variant="light"
                                    color={selectedInquiry.handled ? 'gray' : 'green'}
                                    leftSection={selectedInquiry.handled ? <IconArrowBackUp size={16} /> : <IconCheck size={16} />}
                                    loading={busyInquiryId === selectedInquiry._id}
                                    disabled={busyInquiryId !== null && busyInquiryId !== selectedInquiry._id}
                                    onClick={() => handleToggleHandled?.(selectedInquiry, adminNoteDraft)}
                                >
                                    {selectedInquiry.handled ? 'Reopen ticket' : 'Close ticket'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="light"
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    loading={busyInquiryId === selectedInquiry._id}
                                    disabled={busyInquiryId !== null && busyInquiryId !== selectedInquiry._id}
                                    onClick={() => handleDeleteInquiry?.(selectedInquiry)}
                                >
                                    Delete
                                </Button>
                            </Group>
                        </>
                    ) : (
                        <Stack gap={2}>
                            <Text size="sm" fw={700}>Admin note</Text>
                            <Text size="sm" c={selectedInquiry.adminNote ? undefined : 'dimmed'} className="whitespace-pre-wrap break-words">
                                {selectedInquiry.adminNote || 'No note yet.'}
                            </Text>
                        </Stack>
                    )}
                </Stack>
            )}
        </Modal>
    );
}

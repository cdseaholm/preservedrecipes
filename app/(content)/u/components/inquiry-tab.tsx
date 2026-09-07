'use client'

import { useEffect, useMemo, useState } from "react";
import { IInquiry, InquiryFormType } from "@/models/types/misc/inquiry";
import { IUser } from "@/models/types/personal/user";
import { useInquiryActions } from "@/components/hooks/inquiry/inquiry-hooks";
import { useUserStore } from "@/context/userStore";
import { formatShortDate } from "@/lib/data-normalization";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Group,
    Pagination,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBug, IconCheck, IconMessageCircle, IconSearch, IconTrash } from "@tabler/icons-react";

type InquiryTabContentProps = {
    initialInquiries: IInquiry[];
    user: IUser;
    isAdmin: boolean;
    compact?: boolean;
    showList?: boolean;
    onSubmitted?: () => void;
};

const inquiryTypeOptions = [
    { value: 'General', label: 'General' },
    { value: 'Bug Report', label: 'Bug report' },
    { value: 'Feature Request', label: 'Feature request' },
    { value: 'Suggestion', label: 'Suggestion' },
    { value: 'Other', label: 'Other' },
];

const INQUIRIES_PER_PAGE = 5;
const INQUIRY_CARD_MIN_HEIGHT = 132;

function getInquiryDisplayTitle(inquiry: IInquiry) {
    const formattedDate = formatShortDate(inquiry.createdAt);
    return formattedDate ? `${inquiry.inquiryType} ${formattedDate}` : inquiry.inquiryType;
}

export default function InquiryTabContent({ initialInquiries, user, isAdmin, compact = false, showList = true, onSubmitted }: InquiryTabContentProps) {
    const [search, setSearch] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [busyInquiryId, setBusyInquiryId] = useState<string | null>(null);
    const { loading, createInquiry, editInquiries, deleteInquiries, storedInquiries } = useInquiryActions();
    const setInquiries = useUserStore(state => state.setInquiries);

    const inquiryForm = useForm<InquiryFormType>({
        mode: 'uncontrolled',
        initialValues: {
            id: '',
            inquiryTitle: '',
            inquirerName: user.name || '',
            inquirerEmail: user.email || '',
            inquiryType: '',
            inquiryMessage: '',
            handled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        validate: {
            inquiryType: (value) => value ? null : 'Choose a topic',
            inquiryMessage: (value) => value.trim().length > 0 ? null : 'Add a message',
        },
    });

    useEffect(() => {
        if (showList) {
            setInquiries(initialInquiries);
        }
    }, [initialInquiries, setInquiries, showList]);

    const filteredInquiries = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        return storedInquiries.filter((inquiry) => {
            if (!normalizedSearch) return true;

            return [
                inquiry.inquiryTitle,
                inquiry.inquiryType,
                inquiry.inquiryMessage,
                inquiry.inquirerName,
                inquiry.inquirerEmail,
            ].some(value => value?.toLowerCase().includes(normalizedSearch));
        }).sort((a, b) => {
            if (a.handled !== b.handled) {
                return a.handled ? 1 : -1;
            }

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [search, storedInquiries]);

    const inquiriesPerPage = compact ? 1 : INQUIRIES_PER_PAGE;
    const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / inquiriesPerPage));
    const paginatedInquiries = useMemo(() => {
        const startIndex = (activePage - 1) * inquiriesPerPage;
        return filteredInquiries.slice(startIndex, startIndex + inquiriesPerPage);
    }, [activePage, filteredInquiries, inquiriesPerPage]);
    const visibleListItemCount = filteredInquiries.length > 0 ? paginatedInquiries.length : 1;
    const placeholderCount = compact ? 0 : Math.max(0, inquiriesPerPage - visibleListItemCount);
    const inquiryCardHeight = compact ? 116 : INQUIRY_CARD_MIN_HEIGHT;

    useEffect(() => {
        setActivePage(1);
    }, [search]);

    useEffect(() => {
        setActivePage((currentPage) => Math.min(currentPage, totalPages));
    }, [totalPages]);

    const handleCreate = async () => {
        inquiryForm.setFieldValue('inquirerName', user.name || user.email);
        inquiryForm.setFieldValue('inquirerEmail', user.email);

        const created = await createInquiry({ inquiryForm, sessionPassed: null });

        if (created) {
            inquiryForm.setValues({
                id: '',
                inquiryTitle: '',
                inquirerName: user.name || '',
                inquirerEmail: user.email || '',
                inquiryType: '',
                inquiryMessage: '',
                handled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            onSubmitted?.();
        }
    };

    const handleToggleHandled = async (inquiry: IInquiry) => {
        setBusyInquiryId(inquiry._id);
        await editInquiries([{ ...inquiry, handled: !inquiry.handled, updatedAt: new Date() }]);
        setBusyInquiryId(null);
    };

    const handleDelete = async (inquiry: IInquiry) => {
        const confirmed = window.confirm('Delete this inquiry?');
        if (!confirmed) return;

        setBusyInquiryId(inquiry._id);
        await deleteInquiries([inquiry]);
        setBusyInquiryId(null);
    };

    const feedbackForm = (
        <Card withBorder radius="md" padding={compact ? "sm" : "md"} className="min-h-0 bg-secondaryBack">
            <Stack gap={compact ? "xs" : "md"} className="h-full min-h-0">
                <Group gap="sm" align="flex-start" wrap="nowrap">
                    <IconMessageCircle size={compact ? 18 : 20} className="mt-1 shrink-0" />
                    <div>
                        <Text fw={700}>Send feedback</Text>
                        <Text size="sm" c="dimmed" lineClamp={compact ? 1 : undefined}>
                            Tell me about bugs, rough edges, ideas, or what is working well.
                        </Text>
                    </div>
                </Group>

                <Select
                    label="Topic"
                    placeholder="Choose a topic"
                    data={inquiryTypeOptions}
                    leftSection={<IconBug size={16} />}
                    key={inquiryForm.key('inquiryType')}
                    error={inquiryForm.errors.inquiryType}
                    {...inquiryForm.getInputProps('inquiryType')}
                />

                <Textarea
                    label="Message"
                    placeholder="What happened, what did you expect, or what would make this better?"
                    autosize
                    minRows={compact ? 3 : 6}
                    maxRows={compact ? 3 : undefined}
                    key={inquiryForm.key('inquiryMessage')}
                    error={inquiryForm.errors.inquiryMessage}
                    {...inquiryForm.getInputProps('inquiryMessage')}
                />

                <Button type="button" loading={loading} disabled={loading} onClick={handleCreate} className="mt-auto">
                    Submit feedback
                </Button>
            </Stack>
        </Card>
    );

    if (!showList) {
        return feedbackForm;
    }

    return (
        <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {feedbackForm}

            <Stack gap="sm" className="h-full min-h-0">
                <Group justify="space-between" align="flex-end" gap="sm">
                    <div>
                        <Text fw={700}>{isAdmin ? 'All inquiries' : 'Your inquiries'}</Text>
                        <Text size="sm" c="dimmed" lineClamp={compact ? 1 : undefined}>
                            {isAdmin ? 'Admin view is showing feedback from every user.' : 'You can see feedback you have submitted.'}
                        </Text>
                    </div>
                    {isAdmin && <Badge variant="light" color="accent">Admin</Badge>}
                </Group>

                <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search feedback"
                    leftSection={<IconSearch size={16} />}
                />

                <Stack gap="sm" className="min-h-0 flex-1 overflow-hidden">
                    {filteredInquiries.length > 0 ? (
                        paginatedInquiries.map((inquiry) => (
                            <Card
                                key={inquiry._id}
                                withBorder
                                radius="md"
                                padding={compact ? "sm" : "md"}
                                className="overflow-hidden bg-mainBack/60"
                                style={{ minHeight: inquiryCardHeight }}
                            >
                                <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                                    <Stack gap={6} className="min-w-0">
                                        <Group gap="xs">
                                            <Badge variant="light" color={inquiry.handled ? 'green' : 'yellow'}>
                                                {inquiry.handled ? 'Handled' : 'Open'}
                                            </Badge>
                                            <Badge variant="outline" color="accent">
                                                {inquiry.inquiryType}
                                            </Badge>
                                        </Group>
                                        <Text fw={700} className="truncate" title={getInquiryDisplayTitle(inquiry)}>
                                            {getInquiryDisplayTitle(inquiry)}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {isAdmin ? `${inquiry.inquirerName} · ${inquiry.inquirerEmail}` : formatShortDate(inquiry.createdAt)}
                                        </Text>
                                        <Text size="sm" className={compact ? "line-clamp-1 whitespace-pre-wrap" : "line-clamp-2 whitespace-pre-wrap"}>
                                            {inquiry.inquiryMessage}
                                        </Text>
                                    </Stack>

                                    {isAdmin && (
                                        <Group gap={4} wrap="nowrap">
                                            <Tooltip label={inquiry.handled ? 'Mark open' : 'Mark handled'}>
                                                <ActionIcon
                                                    type="button"
                                                    variant="light"
                                                    color={inquiry.handled ? 'gray' : 'green'}
                                                    onClick={() => handleToggleHandled(inquiry)}
                                                    loading={busyInquiryId === inquiry._id}
                                                    disabled={busyInquiryId !== null && busyInquiryId !== inquiry._id}
                                                    aria-label={inquiry.handled ? 'Mark inquiry open' : 'Mark inquiry handled'}
                                                >
                                                    <IconCheck size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Delete">
                                                <ActionIcon
                                                    type="button"
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => handleDelete(inquiry)}
                                                    loading={busyInquiryId === inquiry._id}
                                                    disabled={busyInquiryId !== null && busyInquiryId !== inquiry._id}
                                                    aria-label="Delete inquiry"
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    )}
                                </Group>
                            </Card>
                        ))
                    ) : (
                        <Card
                            withBorder
                            radius="md"
                            padding="xl"
                            className="bg-mainBack/60 text-center"
                            style={{ minHeight: inquiryCardHeight }}
                        >
                            <Text fw={700}>No feedback found</Text>
                            <Text size="sm" c="dimmed">
                                {search ? 'Try a different search.' : 'Submitted feedback will appear here.'}
                            </Text>
                        </Card>
                    )}
                    {Array.from({ length: placeholderCount }).map((_, index) => (
                        <Card
                            key={`inquiry-placeholder-${index}`}
                            withBorder
                            radius="md"
                            padding="md"
                            aria-hidden="true"
                            className="invisible bg-mainBack/60"
                            style={{ minHeight: INQUIRY_CARD_MIN_HEIGHT }}
                        />
                    ))}
                    {filteredInquiries.length > inquiriesPerPage && (
                        <Group justify="center" className="mt-auto">
                            <Pagination
                                total={totalPages}
                                value={activePage}
                                onChange={setActivePage}
                                size={compact ? "xs" : "sm"}
                                withEdges
                            />
                        </Group>
                    )}
                </Stack>
            </Stack>
        </div>
    );
}

'use client'

import { IPost } from "@/models/types/misc/post";
import { Badge, Card, Group, Text, ThemeIcon } from "@mantine/core";
import { IconChevronRight, IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";

export default function PostCard({ index, post, communityId }: { index: number, post: IPost, communityId: string }) {
    const preview = post.content?.find(item => item?.trim()) || '';

    return (
        <Card
            key={index}
            component={Link}
            href={`/communities/${communityId}/posts/${post._id}`}
            withBorder
            radius="md"
            padding="md"
            className="mb-3 w-full bg-mainBack/60 text-mainText transition-colors hover:bg-secondaryBack"
        >
            <Group justify="space-between" gap="md" wrap="nowrap">
                <Group gap="sm" className="min-w-0" wrap="nowrap">
                    <ThemeIcon variant="light" color="accent" radius="md">
                        <IconMessageCircle size={18} />
                    </ThemeIcon>
                    <div className="min-w-0">
                        <Group gap="xs">
                            <Text fw={700} className="truncate">
                                {post.name || 'Untitled post'}
                            </Text>
                            {post.category.length > 0 && (
                                <Badge variant="light" color="gray">
                                    {post.category[0]}
                                </Badge>
                            )}
                        </Group>
                        <Text size="sm" c="dimmed" className="truncate">
                            {preview || `${post.commentIDs.length} comments · ${new Date(post.createdAt).toLocaleDateString()}`}
                        </Text>
                    </div>
                </Group>
                <IconChevronRight size={18} className="shrink-0 text-mainText/50" />
            </Group>
        </Card>
    );
}

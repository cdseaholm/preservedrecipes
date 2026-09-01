'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import {
    Box,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    rem,
} from "@mantine/core";
import React from "react";

type DashboardCardProps = {
    children: React.ReactNode;
    className?: string;
};

export function DashboardCard({ children, className = "" }: DashboardCardProps) {
    return (
        <Card
<<<<<<< Updated upstream
            padding="sm"
            radius="md"
            withBorder
            w="100%"
            className={`flex flex-1 flex-col border-[var(--surfaceBorder)] bg-[var(--surfaceRaised)] shadow-[var(--softShadow)] backdrop-blur-sm ${className}`}
=======
            shadow="md"
            padding="md"
            radius="md"
            withBorder
            w="100%"
            className={`flex min-w-0 flex-1 flex-col overflow-hidden ${className}`}
>>>>>>> Stashed changes
        >
            {children}
        </Card>
    );
}

type DashboardHeaderProps = {
    icon: React.ReactNode;
    eyebrow: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    aside?: React.ReactNode;
};

export function DashboardHeader({ icon, eyebrow, title, description, aside }: DashboardHeaderProps) {
    return (
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap" className="rounded-md bg-mainBack/45 p-3 ring-1 ring-accent/10 sm:p-4">
            <Stack gap={6} className="min-w-0 flex-1">
                <Group gap="xs" wrap="wrap">
                    <ThemeIcon variant="filled" color="accent" size="lg" radius="md">
                        {icon}
                    </ThemeIcon>
                    {eyebrow}
                </Group>
                <Title order={2} c="mainText" className="break-words text-2xl sm:text-3xl">
                    {title}
                </Title>
                <Text c="dimmed" maw={rem(680)} size="sm" className="sm:text-base">
                    {description}
                </Text>
            </Stack>
            {aside}
        </Group>
    );
}

export type DashboardStat = {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    description: React.ReactNode;
};

export function DashboardStatsGrid({ stats }: { stats: DashboardStat[] }) {
    return (
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={{ base: "xs", sm: "md" }}>
            {stats.map(stat => (
                <Box
                    key={String(stat.label)}
                    p={{ base: "sm", sm: "md" }}
                    className="rounded-md border border-accent/15 bg-[var(--surfaceWash)] shadow-[var(--tightShadow)]"
                >
                    <Group justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                        <Stack gap={2} className="min-w-0">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" className="truncate">
                                {stat.label}
                            </Text>
                            <Text size="clamp(1.5rem, 6vw, 2rem)" fw={800} c="accent" lh={1}>
                                {stat.value}
                            </Text>
                        </Stack>
                        <ThemeIcon variant="light" color="accent" size="md" radius="md" className="shrink-0">
                            {stat.icon}
                        </ThemeIcon>
                    </Group>
                    <Text size="xs" c="dimmed" mt="sm" lineClamp={1}>
                        {stat.description}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    );
}

type InfoPageShellProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
};

export function InfoPageShell({ title, description, children, actions }: InfoPageShellProps) {
    return (
        <ContentWrapper containedChild={false} paddingNeeded={true}>
            <section className="flex min-h-[80dvh] w-full flex-col items-center gap-6">
                <Stack gap="xs" align="center" ta="center" maw={rem(780)}>
                    <Text tt="uppercase" fw={800} size="xs" c="accent">
                        RecipeSafe
                    </Text>
                    <Title order={1} c="mainText" className="text-3xl sm:text-4xl md:text-5xl">
                        {title}
                    </Title>
                    {description && (
                        <Text c="dimmed" size="lg">
                            {description}
                        </Text>
                    )}
                    {actions}
                </Stack>
                <div className="flex w-full flex-1 flex-col items-stretch gap-6">
                    {children}
                </div>
            </section>
        </ContentWrapper>
    );
}

export const infoPaperClass =
    "mx-auto flex min-h-[52dvh] w-full rounded-md border border-accent/20 bg-altBack/80 px-6 py-8 text-base leading-7 text-mainText shadow-md backdrop-blur-md md:px-10 md:py-10 md:text-lg";

export const infoCenteredTextClass =
    "mx-auto max-w-4xl self-center text-center";

'use client'

import { IFamily } from "@/models/types/family/family";
import {
    Badge,
    Box,
    Divider,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon
} from "@mantine/core";
import {
    IconBook2,
    IconShieldCheck,
    IconUsers,
    IconWorld
} from "@tabler/icons-react";


export default function FamilyDashboard({ family }: { family: IFamily }) {

    const members = family.familyMembers ?? [];
    const recipes = family.recipeIDs ?? [];
    const heritage = family.heritage ?? [];
    
    const adminCount = members.filter(member => member.permissionStatus === 'Admin').length;
    const connectedCount = members.filter(member => member.memberConnected).length;

    const stats = [
        {
            label: 'Recipes',
            value: recipes.length,
            icon: <IconBook2 size={22} />,
            description: 'Saved to this family'
        },
        {
            label: 'Members',
            value: members.length,
            icon: <IconUsers size={22} />,
            description: `${connectedCount} connected`
        },
        {
            label: 'Admins',
            value: adminCount,
            icon: <IconShieldCheck size={22} />,
            description: 'Can manage the family'
        },
        {
            label: 'Heritage',
            value: heritage.length,
            icon: <IconWorld size={22} />,
            description: heritage[0]?.name ?? 'Not set yet'
        }
    ];

    return (
        <>

            <Box>
                <Text fw={700} mb="md">Overview</Text>
                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
                    {stats.map(stat => (
                        <Box
                            key={stat.label}
                            p="md"
                            className="rounded-md border border-accent/20 bg-secondaryBack/60"
                        >
                            <Group justify="space-between" align="flex-start">
                                <Stack gap={2}>
                                    <Text size="sm" c="dimmed" fw={500}>
                                        {stat.label}
                                    </Text>
                                    <Text size="2rem" fw={800} c="accent" lh={1}>
                                        {stat.value}
                                    </Text>
                                </Stack>
                                <ThemeIcon variant="light" color="accent" size="lg" radius="md">
                                    {stat.icon}
                                </ThemeIcon>
                            </Group>
                            <Text size="sm" c="dimmed" mt="sm">
                                {stat.description}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>

            <Divider />

            <Box p="md" className="rounded-md border border-dashed border-accent/30 bg-mainBack/50">
                <Group justify="space-between" mb="xs">
                    <Text fw={700}>Family Activity</Text>
                    <Badge variant="light" color="gray">Coming soon</Badge>
                </Group>
                <Text c="dimmed">
                    Recent shared recipes, new members, and family updates will appear here once activity tracking is added.
                </Text>
            </Box>
        </>
    )
}

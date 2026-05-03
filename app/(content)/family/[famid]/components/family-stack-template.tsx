'use client'

import { useFamilyStore } from "@/context/familyStore"
import { useUserStore } from "@/context/userStore"
import { IFamily } from "@/models/types/family/family"
import { IUser } from "@/models/types/personal/user"
import { Card, Stack, Group, ThemeIcon, Badge, Title, rem, Text } from "@mantine/core"
import { IconUsers } from "@tabler/icons-react"
import { useEffect } from "react"

export default function FamilyStackTemplate({ children, user, family }: { children: React.ReactNode, user: IUser, family: IFamily }) {

    const setFamily = useFamilyStore(state => state.setFamily);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const members = family.familyMembers ?? [];
    const heritage = family.heritage ?? [];
    const currentMember = members.find(member => member.familyMemberID === user._id || member.familyMemberEmail === user.email);

    useEffect(() => {
        setFamily(family);
        setUserInfo(user);
    }, [family, setFamily, setUserInfo, user]);

    return (
        <div className="flex flex-col justify-start items-center px-2 w-full min-h-[75dvh]">
            <Card shadow="md" padding="xl" radius="md" withBorder w={'100%'} className="flex flex-1 flex-col">
                <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w={'100%'}>
                    <Group justify="space-between" align="flex-start" gap="md">
                        <Stack gap={6}>
                            <Group gap="xs">
                                <ThemeIcon variant="light" color="accent" size="lg" radius="md">
                                    <IconUsers size={20} />
                                </ThemeIcon>
                                <Badge variant="light" color="accent">
                                    {currentMember?.permissionStatus ?? 'Member'}
                                </Badge>
                            </Group>
                            <Title order={2} c="mainText">
                                {family.name || 'Your Family'}
                            </Title>
                            <Text c="dimmed" maw={rem(680)}>
                                A shared place for recipes, family members, and the food traditions you want to keep close.
                            </Text>
                        </Stack>

                        <Group gap="xs">
                            {heritage.slice(0, 3).map(item => (
                                <Badge key={`${item.name}-${item.flagCode}`} variant="outline" color="accent">
                                    {item.name}
                                </Badge>
                            ))}
                            {heritage.length === 0 && (
                                <Badge variant="outline" color="gray">
                                    No heritage set
                                </Badge>
                            )}
                        </Group>
                    </Group>
                    <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w={'100%'}>
                        {children}
                    </Stack>
                </Stack>
            </Card>
        </div>
    )
}

'use client'

import { useFamilyStore } from "@/context/familyStore"
import { useUserStore } from "@/context/userStore"
import { DashboardCard, DashboardHeader } from "@/components/layout/page-shells"
import { IFamily } from "@/models/types/family/family"
import { IUser } from "@/models/types/personal/user"
import { Stack, Group, Badge } from "@mantine/core"
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
            <DashboardCard>
                <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w={'100%'}>
                    <DashboardHeader
                        icon={<IconUsers size={20} />}
                        eyebrow={(
                            <Badge variant="light" color="accent">
                                {currentMember?.permissionStatus ?? 'Member'}
                            </Badge>
                        )}
                        title={family.name || 'Your Family'}
                        description="A shared place for recipes, family members, and the food traditions you want to keep close."
                        aside={(
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
                        )}
                    />
                    <Stack gap="lg" style={{ flex: 1, minHeight: 0 }} w={'100%'}>
                        {children}
                    </Stack>
                </Stack>
            </DashboardCard>
        </div>
    )
}

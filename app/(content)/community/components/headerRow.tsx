'use client'

import { ICommunity } from "@/models/types/community";
import { IUser } from "@/models/types/user";
import { Button, Popover, Badge } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function HeaderRow({ creators, community }: { creators: IUser[], community: ICommunity }) {

    const router = useRouter();

    return (
        <section className="flex flex-row justify-between items-start w-full h-fit">
            <Button leftSection={<IoMdArrowRoundBack />} variant='subtle' size='compact-md' onClick={() => router.back()} aria-label="Back">
                Back
            </Button>
            <div className="flex flex-col justify-start items-end h-fit w-fit space-y-2">
                <h1 className="text-lg md:text-xl font-semibold underline">{community.name}</h1>
                <div className="flex flex-row justify-end items-center w-fit h-fit space-x-2">
                    <Popover width={200} position='bottom-end' withArrow shadow="md" radius={'md'} >
                        <Popover.Target>
                            <Badge title="See Community Creators" size='lg' style={{ cursor: 'pointer' }}>{<MdOutlineAdminPanelSettings size={20} />}</Badge>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <ul className="underline">
                                Admins:
                            </ul>
                            {creators.length > 0 ? <ul>
                                {creators.map((creator) => (
                                    <li key={creator._id}>{creator.name}</li>
                                ))}
                            </ul> : ('No creators here')}
                        </Popover.Dropdown>
                    </Popover>
                    <Popover width={200} position='bottom-end' withArrow shadow="md" radius={'md'} >
                        <Popover.Target>
                            <Badge title="Number of users" leftSection={<FaUsers />} size='lg' style={{ cursor: 'pointer' }}>{`${community.communityMemberIDs.length}`}</Badge>
                        </Popover.Target>
                        <Popover.Dropdown>
                            {`Number of users: ${community.communityMemberIDs.length}`}
                        </Popover.Dropdown>
                    </Popover>
                </div>
            </div>
        </section>
    )
}
'use client'

import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IUserView } from "@/models/types/family/member-view";
import { UpdateFamilyMemberStatuses } from "@/utils/server-actions/family/update";
import { Button, PasswordInput, Select } from "@mantine/core";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BiLeftArrow } from "react-icons/bi"
import { toast } from "sonner";

const statusOptions: IFamilyMember["permissionStatus"][] = ["Admin", "Member", "Guest"];

export default function SpecificMemberView({
    famId,
    memberToView,
    familyMember,
    canEditStatus,
}: {
    famId: string;
    memberToView: IUserView;
    familyMember: IFamilyMember;
    canEditStatus: boolean;
}) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [permissionStatus, setPermissionStatus] = useState<IFamilyMember["permissionStatus"]>(familyMember.permissionStatus);
    const [adminPassword, setAdminPassword] = useState("");

    const details = [
        'Recipes Created',
        'Date joined Family',
        'Ratings/Comments',
        'Communities'
    ];

    const handleUpdateStatus = () => {
        if (!adminPassword) {
            toast.error("Password is required");
            return;
        }

        startTransition(async () => {
            const result = await UpdateFamilyMemberStatuses(
                famId,
                [{ ...familyMember, permissionStatus }],
                adminPassword,
                `/family/${famId}/members/${familyMember.familyMemberID}`,
            );

            if (!result.success) {
                toast.error(result.message || "Failed to update member status");
                return;
            }

            toast.success("Member status updated");
            setAdminPassword("");
            router.refresh();
        });
    };

    return (
        <div className="flex flex-col justify-start items-center w-full flex-1 gap-4">
            <PageSpecButtonBox
                leftHandButtons={
                    <Link href={`/family/${famId}/members`} className={`h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-md space-x-1 cursor-pointer`} aria-label="Go back to Members list">
                        <BiLeftArrow />
                        <p>{`Back`}</p>
                    </Link>
                }
                rightHandButtons={
                    <h2 className="text-lg font-semibold">
                        {`${memberToView.familyMemberName} Overview`}
                    </h2>
                }
                leftLabel="Back to Members"
                rightLabel="Member Overview"
            />
            <div className="flex flex-col justify-start items-start w-[100%] flex-1 min-h-[450px] bg-mainContent border border-accent/30 rounded-md p-4">
                {canEditStatus && (
                    <div className="mb-4 flex w-full flex-col gap-3 rounded-md border border-accent/30 bg-mainBack/60 p-3 sm:flex-row sm:items-end">
                        <Select
                            label="Permission"
                            data={statusOptions}
                            value={permissionStatus}
                            onChange={(value) => {
                                if (value) setPermissionStatus(value as IFamilyMember["permissionStatus"]);
                            }}
                            className="w-full sm:max-w-[220px]"
                            disabled={isPending}
                        />
                        <PasswordInput
                            label="Admin password"
                            value={adminPassword}
                            onChange={(event) => setAdminPassword(event.currentTarget.value)}
                            className="w-full sm:max-w-[260px]"
                            disabled={isPending}
                        />
                        <Button
                            type="button"
                            onClick={handleUpdateStatus}
                            loading={isPending}
                            disabled={permissionStatus === familyMember.permissionStatus || !adminPassword}
                        >
                            Update role
                        </Button>
                    </div>
                )}
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
                    {details.map((det, index) => {
                        return (
                            <div className="min-w-[200px] min-h-[200px] rounded-md border border-accent/30 p-1 flex flex-col justify-center items-center text-center" key={index}>
                                {det}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

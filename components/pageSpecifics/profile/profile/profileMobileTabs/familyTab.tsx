'use client'

import LinkTextButton from "@/components/buttons/linkTextButtons";

export default function FamilyTabs({ userInfo }: { userInfo: string }) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 bg-mainContent h-full w-full">
            {
                userInfo ? (
                    <LinkTextButton link="/family/settings" content="Family Settings" />
                ) : (
                    <p>Create a family</p>
                )
            }
        </div>
    )
}
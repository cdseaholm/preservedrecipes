'use client'

import InfoPopover from "@/components/popovers/infoPopover"
import { useModalStore } from "@/context/modalStore"
import { IUser } from "@/models/types/user"

export default function NoFamTab({ userInfo }: { userInfo: IUser }) {
    return (
        <div className="flex flex-col justify-evenly items-center w-full h-[300px] space-y-3">
            <button onClick={() => useModalStore.getState().setOpenCreateFamilyModal(true)} aria-label="Create Family Tree">
                {`Create a family tree`}
            </button>
            <p>
                {userInfo.userFamilyID}
            </p>
            <InfoPopover title="Looking to join an existing family tree?" infoOne="Have the admin or creator of your family send you an invite either through this site or to your email." infoTwo="From there you just need to accept!" />
        </div>
    )
}
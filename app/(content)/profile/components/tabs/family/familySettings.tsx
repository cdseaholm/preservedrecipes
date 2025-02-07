'use client'

import { AccountButton } from "@/components/buttons/accountButton"
import { IFamily } from "@/models/types/family"

export default function FamilySettings({ familySettings, userFamAdminPrivs, numAdmins, family }: { familySettings: string[], userFamAdminPrivs: boolean, family: IFamily, numAdmins: number }) {

    return (
        <div className="flex flex-col justify-start items-center w-full h-[600px] space-y-4">
                {familySettings.map((tab, index) =>
                    <AccountButton which={tab} key={index} userFamAdminPrivs={userFamAdminPrivs} numAdmins={numAdmins} family={family} />
                )}
        </div>
    )
}
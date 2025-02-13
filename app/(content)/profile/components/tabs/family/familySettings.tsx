'use client'

import { AccountButton } from "@/components/buttons/accountButton"
import { IFamily } from "@/models/types/family"

export default function FamilySettings({ familySettings, userFamAdminPrivs, numAdmins, family }: { familySettings: string[], userFamAdminPrivs: boolean, family: IFamily, numAdmins: number }) {

    return (
        <div className="flex flex-col justify-start items-center w-full h-content divide-y divide-gray-400 space-y-2">
            <div className={`bg-mainBack p-1 w-full min-h-[600px] flex flex-col justify-evenly items-center py-2 sm:px-5`}>
                <div className="flex flex-col justify-start items-start w-[100%] h-full bg-mainContent border border-accent/30 rounded-md">
                    {familySettings.map((tab, index) =>
                        <AccountButton which={tab} key={index} userFamAdminPrivs={userFamAdminPrivs} numAdmins={numAdmins} family={family} />
                    )}
                </div>
            </div>
        </div>
    )
}
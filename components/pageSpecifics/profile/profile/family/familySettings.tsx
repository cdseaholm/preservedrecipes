'use client'

import { AccountButton } from "@/components/buttons/accountButton"
import { IFamily } from "@/models/types/family"

export default function FamilySettings({ familySettings, userFamAdminPrivs, handleSettings, numAdmins, family }: { familySettings: string[], userFamAdminPrivs: boolean, handleSettings: () => void, family: IFamily, numAdmins: number }) {

    return (
        <div className="flex flex-col justify-start items-center w-full h-[600px] space-y-4">
            {userFamAdminPrivs &&
                <div className="flex flex-row w-full justify-end sm:justify-start items-center p-1 border-b border-gray-400">
                    <button type="button" className="text-blue-700 hover:text-blue-300 hover:underline" onClick={handleSettings}>
                        Family Settings
                    </button>
                </div>
            }
            <div className="flex flex-col justify-center items-center w-full h-full space-y-6">
                {familySettings.map((tab, index) =>
                    <AccountButton which={tab} key={index} userFamAdminPrivs={userFamAdminPrivs} numAdmins={numAdmins} family={family} />
                )}
            </div>
        </div>
    )
}
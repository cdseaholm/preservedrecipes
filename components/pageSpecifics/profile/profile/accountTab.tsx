'use client'

import { AccountButton } from "@/components/buttons/accountButton";
import { IFamily } from "@/models/types/family";

export default function AccountTab({ numAdmins, userAdminPrivs, family }: { numAdmins: number, userAdminPrivs: boolean, family: IFamily }) {

    const profileTabs = ['Profile Settings', 'Account Settings', 'Account History', 'Delete Account'];

    return (
        <div className={`bg-mainBack p-1 w-full h-[600px] flex flex-col justify-center items-center pt-3 px-5 pb-5 space-y-5`}>
            {profileTabs.map((tab, index) =>
                <AccountButton which={tab} key={index} numAdmins={numAdmins} userFamAdminPrivs={userAdminPrivs} family={family} />
            )}
        </div>
    )
}
'use client'

import { AccountButton } from "@/components/buttons/accountButton";
import { IFamily } from "@/models/types/family";
import { ISuggestion } from "@/models/types/suggestion";
import { IUser } from "@/models/types/user";
import { Session } from "next-auth";
import { useState } from "react";

export default function AccountTab({ numAdmins, userAdminPrivs, family, session, suggestions, admin }: { numAdmins: number, userAdminPrivs: boolean, family: IFamily, session: Session | null, suggestions: ISuggestion[], admin: string }) {

    const profileTabs = ['Profile Settings', 'Account Settings', 'Account History', 'Delete Account'];
    const user = session ? session.user : {} as IUser;
    const email = user ? user.email : '';
    const [search, setSearch] = useState('');

    return (
        <div className={`bg-mainBack p-1 w-full h-content flex flex-col justify-center items-center pt-3 px-5 pb-5 space-y-5`}>
            {profileTabs.map((tab, index) =>
                <AccountButton which={tab} key={index} numAdmins={numAdmins} userFamAdminPrivs={userAdminPrivs} family={family} />
            )}
            {admin !== 'null' && email === admin &&
                <div className="flex flex-col justify-start items-start w-[100%] h-full bg-mainContent border border-accent/30 rounded-md">
                    <input type="text" onChange={(e) => setSearch(e.currentTarget.value)} className="flex flex-row w-full p-2 text-sm lg:text-md border-b border-highlight/50 shadow-inner" placeholder={`Search suggestions`} />
                    <div className="scrollbar-thin scrollbar-webkit w-[100%] h-[450px] sm:h-[500px] overflow-auto shadow-inner py-4 px-2 overflow-x-hidden space-y-2 flex flex-col justify-start items-center">
                        {suggestions.length > 0 ? (
                            suggestions.filter((item) => item.suggestionTitle.toLowerCase().includes(search.toLowerCase().trim())).map((item, index) => (
                                <ul className="space-x-2 text-ellipses" key={index}>{index + 1}. {item.suggestion}</ul>
                            ))
                        ) : (
                            <ul className="p-2 text-start pl-7">{`Empty`}</ul>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}
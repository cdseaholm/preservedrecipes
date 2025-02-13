'use client'

import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/familyMember";
import { useUserStore } from "@/context/userStore";
import { useProfileStore } from "@/context/profileStore";
import TabsManager from "./tabs/tabsManager";
import TabsList from "./tabs/tabs";
import { InitializeUserData } from "@/utils/apihelpers/get/initUserData";
import { useRouter } from "next/navigation";

export type ProfilePageType = {
    parent: number,
    child: number
}


export default function ProfilePage() {

    const width = useStateStore(s => s.widthQuery);
    const { data: session } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [accountTabs, setAccountTabs] = useState<string[]>(['Account Settings', 'Account History']);
    const [familyTabs, setFamilyTabs] = useState<string[]>(['Family Recipes', 'Family Members']);
    const parentTabs = ['Account', 'Family', 'Recipes'];
    const userTabs = ['User Recipes', 'User Communities'];

    const userInfo = useUserStore(s => s.userInfo);
    const family = useFamilyStore(s => s.family);
    const tab = useProfileStore(state => state.tab);
    const setTab = useProfileStore(state => state.setTab);

    const members = family ? family.familyMembers : [] as IFamilyMember[];
    const admins = members ? members.filter((member) => member.permissionStatus === 'Admin') : [] as IFamilyMember[];
    const numAdmins = admins ? admins.length : 0;
    const userFamInfo = members ? members.find((member) => member.familyMemberID === userInfo._id.toString()) as IFamilyMember : {} as IFamilyMember;
    const userFamPrivs = userFamInfo ? userFamInfo.permissionStatus as string : '';
    const userAdminPrivs = userFamPrivs && userFamPrivs === 'Admin' ? true : false;

    const [activeParentIndex, setActiveParentIndex] = useState(0);
    const [currentOptions, setCurrentOptions] = useState<string[]>(accountTabs);
    const [chevron, setChevron] = useState(false);

    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';

    const handleChevron = () => {
        setChevron(!chevron)
    }

    const handleParentChange = (value: number | null) => {
        const options = [accountTabs, familyTabs, userTabs];

        if (value === null) {
            setCurrentOptions([]);
            return;
        }

        setCurrentOptions(options[value]);
        setActiveParentIndex(value);
    }

    const handleTab = (tab: number) => {

        if (!currentOptions) {
            console.log('Issue with options');
            return;
        }

        setTab({ parent: activeParentIndex, child: tab });
    }

    useEffect(() => {
        if (!loading) {
            return;
        }
        if (!session) {
            router.replace('/');
            return;
        }
        const user = session.user;
        if (!user) {
            router.replace('/');
            return;
        }
        const email = user.email ? user.email : '';
        if (email === '') {
            router.replace('/');
            return;
        }
        const headers = { 'Authorization': `Bearer ${user}` };
        const init = async () => {
            const initialized = await InitializeUserData({ email: email }, headers) as { status: boolean, message: string, admin: boolean };
            if (!initialized || initialized.status === false) {
                router.replace('/');
                return;
            }
            if (initialized.admin === true) {
                const newAccountTabs = [...accountTabs, 'View Suggestions'];
                setAccountTabs(newAccountTabs);
                //needs to be moved into fam logic, here for now
                const newFamilyTabs = [...familyTabs, 'Family Settings'];
                setFamilyTabs(newFamilyTabs);
            }
            setLoading(false);
        }
        init();
    }, [loading, session, accountTabs, familyTabs, router])

    return (
        <section className="flex flex-col justify-center items-center w-full h-content pt-6">
            <div className="flex flex-col justify-evenly items-start sm:flex-row sm:justify-between sm:items-center px-8 pt-2 w-screen h-content border-b border-accent/50">
                <p className="max-sm:pl-4 max-sm:pb-4">{`${userName}'s Profile`}</p>
                <TabsList width={width} parentTabs={parentTabs} activeParentIndex={activeParentIndex} handleParentChange={handleParentChange} currentChildTabs={currentOptions} chevron={chevron} handleChevron={handleChevron} handleTab={handleTab} />
            </div>
            <TabsManager session={session} activeChildIndex={tab} numAdmins={numAdmins} userAdminPrivs={userAdminPrivs} userInfo={userInfo} />
        </section>
    )
}
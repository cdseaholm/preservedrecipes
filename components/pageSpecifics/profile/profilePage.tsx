'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import TabsList from "./profile/profileHelpers/tabs";
import TabsManager from "./profile/profileHelpers/tabsManager";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/familyMember";
import { useUserStore } from "@/context/userStore";
import { useProfileStore } from "@/context/profileStore";

export type ProfilePageType = {
    parent: number,
    child: number
}


export default function ProfilePage({ admin }: { admin: boolean }) {
    const router = useRouter();
    const width = useStateStore(s => s.widthQuery);
    const { data: session } = useSession();

    const parentTabs = ['Account', 'Family', 'Recipes'];
    const accountTabs = admin ? ['Account Settings', 'Profile Settings', 'Account History', 'Delete Account', 'View Suggestions'] : ['Account Settings', 'Profile Settings', 'Account History', 'Delete Account'];
    const familyTabs = admin ? ['Family Recipes', 'Family Members', 'Family Settings'] : ['Family Recipes', 'Family Members'];
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

    const [loading, setLoading] = useState<boolean>(true);
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
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setLoading(false);
    }, [session, router]);

    if (!session) {
        return (
            <section className="flex flex-col justify-center items-center w-full h-content gap-5 pt-6">
                Error
            </section>
        )
    }

    return (
        loading ? (
            <LoadingSpinner screen={true} />
        ) : (
            <section className="flex flex-col justify-center items-center w-full h-content pt-6">
                <div className="flex flex-col justify-evenly items-start sm:flex-row sm:justify-between sm:items-center px-8 pt-2 w-screen h-content border-b border-accent/50">
                    <p className="max-sm:pl-4 max-sm:pb-4">{`${userName}'s Profile`}</p>
                    <TabsList width={width} parentTabs={parentTabs} activeParentIndex={activeParentIndex} handleParentChange={handleParentChange} currentChildTabs={currentOptions} chevron={chevron} handleChevron={handleChevron} handleTab={handleTab}/>
                </div>
                <TabsManager session={session} activeChildIndex={tab} numAdmins={numAdmins} userAdminPrivs={userAdminPrivs} userInfo={userInfo} />
            </section>
        )
    )
}
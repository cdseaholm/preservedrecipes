'use client'

import ContentButtons from "@/components/buttons/contentButtons";
import LinkButton from "@/components/buttons/linkButtons";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useModalStore } from "@/context/modalStore";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage({ session }: { session: Session | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';

    useEffect(() => {
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setLoading(false);
    }, [session, router]);

    return (
        loading ? (
            <LoadingSpinner />
        ) : (
            <section className={`flex flex-col justify-center items-center h-full w-full w-full overflow-hidden bg-mainBack min-h-[550px]`}>
                <div className="flex flex-col justify-evenly items-center gap-4 py-12 bg-mainContent h-full w-full">
                    <div className="flex flex-row justify-center items-center text-xl md:text-2xl pb-8">
                        {`Welcome to your profile ${userName}`}
                    </div>
                    <label className="underline font-bold text-sm md:text-base flex justify-center items-center text-center">
                        Your P.Rec Actions:
                    </label>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <ContentButtons extraProps={'w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5'} onClick={() => setOpenCreateRecipeModal(true)} content="Create New Recipe"/>
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <ContentButtons extraProps={'w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5'} onClick={() => toast.info('Vacation History')} content="Family Recipes" />
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center py-2  pb-4">
                        <div className="flex flex-col w-full h-full items-center">
                            <div className="text-mainText">
                                Not a part of a Family Recipe Tree?
                            </div>
                            <ContentButtons extraProps={'w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5'} onClick={() => toast.info('Ask AI for Vacation Ideas')} content="Start a Family Recipe Tree" />
                            <div>
                                -Or-
                            </div>
                            <ContentButtons extraProps="w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5" onClick={() => toast.info('Join Community')} content="Join a public community" />
                        </div>
                    </div>
                    <label className="underline font-bold text-sm md:text-base flex justify-center items-center text-center">
                        Your Profile Actions:
                    </label>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <LinkButton extraProps="" href={'/profile/settings'} content="Profile Settings" />
                        {/**Add in ID props to URL for family/accounts */}
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <LinkButton extraProps="" href="/family/settings" content="Family Settings" />
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <LinkButton extraProps="" href="/account" content="Account Settings" />
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <LinkButton extraProps="" href="/account" content="Account History" />
                    </div>
                </div>
            </section>
        )
    );
}
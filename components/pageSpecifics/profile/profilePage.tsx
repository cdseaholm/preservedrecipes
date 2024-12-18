'use client'

import ContentButtons from "@/components/buttons/contentButtons";
import LinkButton from "@/components/buttons/linkButtons";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage({ session }: { session: Session | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
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
            <section className="flex flex-col justify-center items-center bg-mainBack" style={{ minHeight: '100vh', width: '100vw' }}>
                <div className="flex flex-col justify-evenly items-center gap-4 md:gap-x-16 w-11/12 h-4/5 md:w-1/2 md:h-1/2 py-12 bg-mainContent rounded-md border border-mainText/30">
                    <div className="flex flex-row justify-center items-center text-xl md:text-2xl pb-8">
                        {`Welcome to your profile ${userName}`}
                    </div>
                    <label className="underline font-bold text-sm md:text-base flex justify-center items-center text-center">
                        Your P.Rec Actions:
                    </label>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <ContentButtons extraProps={''} onClick={() => toast.info('Create New Vacation Plan')} content="Create New Recipe" />
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center">
                        <ContentButtons extraProps={''} onClick={() => toast.info('Vacation History')} content="Family Recipes" />
                    </div>
                    <div className="flex flex-row w-full h-full justify-center items-center py-2  pb-4">
                        <div className="flex flex-col w-full h-full items-center">
                            <div className="text-mainText">
                                Not a part of a Family Recipe Tree?
                            </div>
                            <ContentButtons extraProps={''} onClick={() => toast.info('Ask AI for Vacation Ideas')} content="Start a Family Recipe Tree" />
                            <div>
                                -Or-
                            </div>
                            <ContentButtons extraProps="" onClick={() => toast.info('Join Community')} content="Join a public community" />
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
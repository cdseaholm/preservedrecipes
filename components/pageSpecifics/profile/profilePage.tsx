'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useModalStore } from "@/context/modalStore";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const buttonStyle = "flex justify-center items-center border border-neutral-200 rounded-md p-4 hover:bg-neutral-200 text-xs md:text-sm";

export default function ProfilePage({ session }: { session: Session | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const setOpenPreferencesModal = useModalStore(state => state.setOpenPreferencesModal);
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';

    useEffect(() => {
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setLoading(false);
    }, [session]);

    return (
        loading ? (
            <LoadingSpinner />
        ) : (
            <section className="flex flex-col justify-start items-center" style={{ minHeight: '100vh', width: '100vw' }}>
                <div className="flex flex-row justify-center items-center text-lg md:text-xl" style={{ minHeight: '15vh' }}>
                    {`Welcome to your profile ${userName}`}
                </div>
                <div className="grid grid-cols-1 grid-rows-8 gap-5 gap-x-4 md:gap-x-16 w-11/12 h-4/5 md:w-1/2 md:h-1/2">
                    <label className="underline font-bold text-sm md:text-base flex justify-center items-center text-center">
                        Your Vacay-AI Actions:
                    </label>
                    <button className={buttonStyle} onClick={() => toast.info('Create New Vacation Plan')}>
                        Create New Vacation Plan
                    </button>
                    <button className={buttonStyle} onClick={() => toast.info('Ask AI for Vacation Ideas')}>
                        Ask AI for Vacation Ideas
                    </button>
                    <button className={buttonStyle} onClick={() => toast.info('Vacation History')}>
                        Vacation History
                    </button>
                    <label className="underline font-bold text-sm md:text-base flex justify-center items-center text-center">
                        Your Profile Actions:
                    </label>
                    <button className={buttonStyle} onClick={() => toast.info('Profile Settings')}>
                        Profile Settings
                    </button>
                    <button className={buttonStyle} onClick={() => setOpenPreferencesModal(true)}>
                        Update Preferences
                    </button>
                    <button className={buttonStyle} onClick={() => toast.info('Account Settings')}>
                        Account Settings
                    </button>
                </div>
            </section>
        )
    );
}
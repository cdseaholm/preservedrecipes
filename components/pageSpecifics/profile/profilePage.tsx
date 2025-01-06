'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DesktopProfilePage from "./profile/desktop";
import MobileProfilePage from "./profile/mobile";

export default function ProfilePage({ session }: { session: Session | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';
    const width = useStateStore(s => s.widthQuery);

    const handleCreate = (which: string, open: boolean) => {
        if (which === 'recipe') {
            setOpenCreateRecipeModal(open);
        }
    }

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
            width < 700 ? (
                <MobileProfilePage handleCreate={handleCreate} userName={userName ? userName : ''} userInfo=''/>
            ) : (
                <DesktopProfilePage handleCreate={handleCreate} userName={userName ? userName : ''} userInfo=''/>
            )
        )
    );
}
'use client'

import { useUserStore } from "@/context/userStore";
import RegisterModal from "../modals/register";
import SignInModal from "../modals/signIn";
import SignOutModal from "../modals/signOut";
import { Session } from "next-auth";
import InitPreferencesModal from "../modals/initStatesForModals/initPreferences";
import { useModalStore } from "@/context/modalStore";

export default function ModalProvider({session, handleUpdate}: {session: Session | null, handleUpdate: () => Promise<void>}) {
    
    const userPreferences = useUserStore(state => state.userPreferences);
    const openPreferencesModal = useModalStore(state => state.openPreferencesModal);

    return (
        <>
            <SignInModal session={session} handleUpdate={handleUpdate}/>
            <SignOutModal session={session} handleUpdate={handleUpdate}/>
            <RegisterModal session={session} handleUpdate={handleUpdate}/>
            <InitPreferencesModal userPreferences={userPreferences} session={session} handleUpdate={handleUpdate} openPreferencesModal={openPreferencesModal}/>
        </>
    );
}
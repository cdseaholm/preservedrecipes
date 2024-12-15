'use client'

import RegisterModal from "../modals/register";
import SignInModal from "../modals/signIn";
import SignOutModal from "../modals/signOut";
import { Session } from "next-auth";

export default function ModalProvider({session, handleUpdate}: {session: Session | null, handleUpdate: () => Promise<void>}) {

    return (
        <>
            <SignInModal session={session} handleUpdate={handleUpdate}/>
            <SignOutModal session={session} handleUpdate={handleUpdate}/>
            <RegisterModal session={session} handleUpdate={handleUpdate}/>
        </>
    );
}
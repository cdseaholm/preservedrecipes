'use client'

import { useModalStore } from "@/context/modalStore";
import ParentRecipeModal from "../modals/createRecipe/parentRecipeModal";
import RegisterModal from "../modals/register";
import SignInModal from "../modals/signIn";
import SignOutModal from "../modals/signOut";
import { Session } from "next-auth";

export default function ModalProvider({session, handleUpdate}: {session: Session | null, handleUpdate: () => Promise<void>}) {

    const openCreateRecipeModal = useModalStore(state => state.openCreateRecipeModal);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);

    const handleCloseCreateRecipe = () => {
        setOpenCreateRecipeModal(false);
    }

    return (
        <>
            <SignInModal session={session} handleUpdate={handleUpdate}/>
            <SignOutModal session={session} handleUpdate={handleUpdate}/>
            <RegisterModal session={session} handleUpdate={handleUpdate}/>
            <ParentRecipeModal session={session} handleUpdate={handleUpdate} open={openCreateRecipeModal} handleCloseCreateRecipe={handleCloseCreateRecipe} />
        </>
    );
}
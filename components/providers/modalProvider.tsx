'use client'

import { useModalStore } from "@/context/modalStore";
import ParentRecipeModal from "../modals/createRecipe/parentRecipeModal";
import RegisterModal from "../modals/register";
import SignInModal from "../modals/signIn";
import SignOutModal from "../modals/signOut";
import AlertModal from "../modals/alert/alertModal";
import { useSession } from "next-auth/react";

export default function ModalProvider() {

    const { data: session, update } = useSession();
    const openCreateRecipeModal = useModalStore(state => state.openCreateRecipeModal);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);

    const handleCloseCreateRecipe = () => {
        setOpenCreateRecipeModal(false);
    }

    const handleUpdate = async () => {
        await update();
    };

    return (
        <>
            <SignInModal session={session} handleUpdate={handleUpdate} />
            <SignOutModal session={session} handleUpdate={handleUpdate} />
            <RegisterModal session={session} handleUpdate={handleUpdate} />
            <ParentRecipeModal session={session} handleUpdate={handleUpdate} open={openCreateRecipeModal} handleCloseCreateRecipe={handleCloseCreateRecipe} />
            <AlertModal />
        </>
    );
}
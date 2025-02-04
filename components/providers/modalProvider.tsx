'use client'

import { useModalStore } from "@/context/modalStore";
import ParentRecipeModal from "../modals/createRecipe/recipeModal";
import SignInModal from "../modals/signIn";
import AlertModal from "../modals/alert/alertModal";
import { useSession } from "next-auth/react";
import ParentFamilyModal from "../modals/createFamily/familyModal";
import SuggestionModal from "../modals/suggestion/parentSuggestionModal";
import AddFamMemsModal from "../modals/createFamily/addFamMemModal";
import InviteSignInModal from "../modals/inviteSignIn";
import { ModalsProvider } from "@mantine/modals";

export default function ModalProvider() {

    const { data: session, update } = useSession();
    const openCreateRecipeModal = useModalStore(state => state.openCreateRecipeModal);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const setOpenCreateFamilyModal = useModalStore(state => state.setOpenCreateFamilyModal);

    const handleCloseCreateRecipe = () => {
        setOpenCreateRecipeModal(false);
    }

    const handleCloseCreateFamily = () => {
        setOpenCreateFamilyModal(false);
    }

    const handleUpdate = async () => {
        await update();
    };

    return (
        <ModalsProvider>
            <SignInModal session={session} handleUpdate={handleUpdate} />
            <ParentRecipeModal session={session} open={openCreateRecipeModal} handleCloseCreateRecipe={handleCloseCreateRecipe} />
            <ParentFamilyModal session={session} handleUpdate={handleUpdate} handleCloseCreateFamily={handleCloseCreateFamily} />
            <SuggestionModal session={session} handleUpdate={handleUpdate} />
            <AddFamMemsModal session={session} handleUpdate={handleUpdate} />
            <InviteSignInModal session={session} handleUpdate={handleUpdate} />
            <AlertModal />
        </ModalsProvider>
    );
}
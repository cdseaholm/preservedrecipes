'use client'

import { useModalStore } from "@/context/modalStore";
import { ModalsProvider } from "@mantine/modals";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
//import { useDataStore } from "@/context/dataStore";

// Dynamically import all modals with ssr: false
const SignInModal = dynamic(() => import("../modals/user/signIn"), { ssr: false });
const ParentFamilyModal = dynamic(() => import("../modals/family/familyModal"), { ssr: false });
const InquiryModal = dynamic(() => import("../modals/inquiry/inquiry"), { ssr: false });
const AddFamMemsModal = dynamic(() => import("../modals/family/addFamMemModal"), { ssr: false });
const InviteSignInModal = dynamic(() => import("../modals/user/inviteSignIn"), { ssr: false });
const CreateCommunityModal = dynamic(() => import("../modals/community/create-community"), { ssr: false });
const AlertModal = dynamic(() => import("../modals/alert/alertModal"), { ssr: false });
const RequestModal = dynamic(() => import("../modals/request/request-modal"), { ssr: false });
const RecipeDrawer = dynamic(() => import("../modals/recipe/recipe-drawer"), { ssr: false });
const CreatePostModal = dynamic(() => import("../modals/post/create-post"), { ssr: false });
const EditCommunity = dynamic(() => import("../modals/community/edit-community"), { ssr: false });

export default function ModalProvider({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const setOpenCreateFamilyModal = useModalStore(state => state.setOpenCreateFamilyModal);
    const viewSpecificInquiry = useModalStore(state => state.viewSpecificInquiry);
    const openCreateCommunityModal = useModalStore(state => state.openCreateCommunityModal);
    const openRecipeForm = useModalStore(state => state.openRecipeForm);
    //const recipeForPostAndPostBackup = useDataStore(state => state.recipeForPostAndPostBackup);
    const openPostModal = useModalStore(state => state.openPostModal);

    const handleCloseCreateFamily = () => {
        setOpenCreateFamilyModal(false);
    }

    return (
        <ModalsProvider>
            <SignInModal />
            <ParentFamilyModal session={session} handleUpdate={handleUpdate} handleCloseCreateFamily={handleCloseCreateFamily} />
            <InquiryModal session={session} inquiry={viewSpecificInquiry} />
            <AddFamMemsModal session={session} handleUpdate={handleUpdate} />
            <InviteSignInModal session={session} handleUpdate={handleUpdate} />
            <CreateCommunityModal open={openCreateCommunityModal} />
            <RequestModal />
            <RecipeDrawer openRecipeForm={openRecipeForm} />
            <AlertModal />
            <CreatePostModal openPostModal={openPostModal} />
            <EditCommunity />
        </ModalsProvider>
    );
}
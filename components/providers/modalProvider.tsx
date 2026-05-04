'use client'

import { useModalStore } from "@/context/modalStore";
import { ModalsProvider } from "@mantine/modals";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { useAlertStore } from "@/context/alertStore";
import { useCommunityStore } from "@/context/communityStore";
import RecipeDrawer from "../modals/recipe/recipe-drawer";
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
const CreatePostModal = dynamic(() => import("../modals/post/create-post"), { ssr: false });
const EditCommunity = dynamic(() => import("../modals/community/edit-community"), { ssr: false });

export default function ModalProvider({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const setOpenCreateFamilyModal = useModalStore(state => state.setOpenCreateFamilyModal);
    const openSignInModal = useModalStore(state => state.openSignInModal);
    const openCreateFamilyModal = useModalStore(state => state.openCreateFamilyModal);
    const openInquiryModal = useModalStore(state => state.openInquiryModal);
    const openAddFamMemsModal = useModalStore(state => state.openAddFamMemsModal);
    const openInviteSignInModal = useModalStore(state => state.openInviteSignInModal);
    const viewSpecificInquiry = useModalStore(state => state.viewSpecificInquiry);
    const openCreateCommunityModal = useModalStore(state => state.openCreateCommunityModal);
    const requestToJoinCommunity = useModalStore(state => state.requestToJoinCommunity);
    const openRecipeForm = useModalStore(state => state.openRecipeForm);
    //const recipeForPostAndPostBackup = useDataStore(state => state.recipeForPostAndPostBackup);
    const openPostModal = useModalStore(state => state.openPostModal);
    const alertModalOpen = useAlertStore(state => state.alertModalOpen);
    const editCommunity = useCommunityStore(state => state.editCommunity);

    const handleCloseCreateFamily = () => {
        setOpenCreateFamilyModal(false);
    }

    return (
        <ModalsProvider>
            {openSignInModal && <SignInModal />}
            {openCreateFamilyModal && (
                <ParentFamilyModal session={session} handleUpdate={handleUpdate} handleCloseCreateFamily={handleCloseCreateFamily} />
            )}
            {openInquiryModal && <InquiryModal session={session} inquiry={viewSpecificInquiry} />}
            {openAddFamMemsModal && <AddFamMemsModal session={session} handleUpdate={handleUpdate} />}
            {openInviteSignInModal && <InviteSignInModal session={session} handleUpdate={handleUpdate} />}
            {openCreateCommunityModal && <CreateCommunityModal open={openCreateCommunityModal} />}
            {requestToJoinCommunity && <RequestModal />}
            {openRecipeForm.type !== '' && <RecipeDrawer openRecipeForm={openRecipeForm} />}
            {alertModalOpen && <AlertModal />}
            {openPostModal && <CreatePostModal openPostModal={openPostModal} />}
            {editCommunity && <EditCommunity />}
        </ModalsProvider>
    );
}

//ADMIN ONLY FOR THE COMMUNITY

'use client';

import { useCommunityStore } from "@/context/communityStore";
import { AttemptDeleteCommunity } from "@/utils/apihelpers/delete/delete-community";
import { toast } from "sonner";

export default function CommunitySettings({ communityID, handleLoading }: { communityID: string, handleLoading: (loading: boolean) => void }) {

    const setEditCommunity = useCommunityStore(state => state.setEditCommunity);
    const Delete = async () => {
        handleLoading(true);
        try {
            if (!communityID || communityID === '') {
                toast.error('Error: Invalid community data');
                handleLoading(false);
                return;
            }
            const attemptDelete = await AttemptDeleteCommunity(communityID);
            if (!attemptDelete.status) {
                toast.error(`Error: ${attemptDelete.message}`);
                handleLoading(false);
                return;
            }
            toast.success('Community deleted successfully.');
            //Redirect to home or communities page after deletion
            window.location.href = '/communities';
        } catch (error) {
            toast.error('An unexpected error occurred while deleting the community.');
            handleLoading(false);
        }
    }

    const confirm = async () => {
        //I will need to work in the idea of which admins may delete or not so that not just any admin can delete
        const confirmed = window.confirm('Are you sure you want to proceed with this action? This action cannot be undone.');
        if (confirmed) {
            Delete();
        }
    }

    const editCommunity = async () => {
        //Future implementation for editing community details
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <button onClick={() => setEditCommunity('edit-name')} type="button" className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Change Name</button>
            <button onClick={() => setEditCommunity('edit-privacy-level')} type="button" className="ml-4 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Change Privacy Level</button>
            <button onClick={confirm} type="button" className="px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">Delete Community</button>
        </div>
    )
}
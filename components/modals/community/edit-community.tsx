'use client'

import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { useCommunityStore } from "@/context/communityStore"
import { Modal, PasswordInput, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";

export default function EditCommunity() {

    const [loading, setLoading] = useState<boolean>(false);
    const editCommunity = useCommunityStore(state => state.editCommunity);
    const setEditCommunityDetails = useCommunityStore(state => state.setEditCommunity);
    const community = useCommunityStore(state => state.community);

    const editCommunityForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: community?.name || '',
            newName: null as string | null,
            privacyLevel: community?.privacyLevel || 'public',
            newPrivacyLevel: null as string | null,
            newPassword: null as string | null,
        },
        validate: {
            newName: (value): string | null => (editCommunity === 'edit-name' && value !== null && value.length < 3 ? 'New community name must be at least 3 characters' : editCommunity === 'edit-name' && value !== null && value.length > 50 ? 'New community name must be less than 50 characters' : editCommunity === 'edit-name' && value === null ? 'New community name is required' : null),
            newPrivacyLevel: (value): string | null => (editCommunity === 'edit-privacy-level' && value === null ? 'New privacy level is required' : null),
            newPassword: (value): string | null => (editCommunity === 'edit-privacy-level' && value !== null && value.length < 6 ? 'New community password must be at least 6 characters' : editCommunity === 'edit-privacy-level' && value === null && editCommunityForm.getValues().privacyLevel !== 'public' ? 'New community password is required for private/hidden communities' : null),
        }
    });

    const handleCancel = () => {
        editCommunityForm.clearErrors();
        editCommunityForm.reset();
        setEditCommunityDetails(null);
    }

    const editCommunityValues = async () => {
        editCommunityForm.clearErrors();
        setLoading(true);
        const valid = editCommunityForm.validate();
        if (valid.hasErrors) {
            editCommunityForm.setErrors(valid.errors);
            setLoading(false);
            return;
        }
        const confirmed = window.confirm('Are you sure you want to save these changes?');
        if (!confirmed) {
            //Future implementation for editing community details
            setLoading(false);
            return;
        }
        try {
            //Future implementation for editing community details
            toast.info('Community details editing coming soon!');
            setLoading(false);
            setEditCommunityDetails(null);
            return;
        } catch (error) {
            console.log('Error editing community details:', error);
            setLoading(false);
            return;
        }

    }

    return (
        <Modal
            opened={editCommunity !== null}
            onClose={handleCancel}
            title={editCommunity === 'edit-privacy-level' ? "Edit Privacy Level" : "Edit Name"}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                className: 'drop-shadow-xl'
            }}
            removeScrollProps={{ allowPinchZoom: true }}
            lockScroll={false}
            size={'80%'}
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <LoadingOverlayComponent visible={loading} />
            <form onSubmit={editCommunityForm.onSubmit(editCommunityValues)} className="w-full h-full flex flex-col justify-center items-center">
                {editCommunity === 'edit-privacy-level' ? (
                    <div>
                        <h2 className="text-lg font-medium mb-4">Current Privacy Level: {community?.privacyLevel}</h2>
                        {/* Future implementation for changing privacy level */}
                        <Select
                            id="new-privacy-level"
                            key={'new-privacy-level'}
                            required
                            placeholder="Select new privacy level"
                            data={[
                                { value: 'public', label: 'Public' },
                                { value: 'private', label: 'Private' },
                                { value: 'hidden', label: 'Hidden' },
                            ]}
                            {...editCommunityForm.getInputProps('privacyLevel')}
                        />
                        {editCommunityForm.getValues().privacyLevel !== 'public' && (
                            <PasswordInput
                                id="new-community-password"
                                key={'new-community-password'}
                                required
                                placeholder="New community password (required for private/hidden)"
                                {...editCommunityForm.getInputProps('newPassword')}
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-lg font-medium mb-4">Current Name: {community?.name}</h2>
                        {/* Future implementation for changing name */}
                        <TextInput
                            id="new-community-name"
                            key={'new-community-name'}
                            required
                            label="New Community Name"
                            placeholder="NewName"
                            {...editCommunityForm.getInputProps('newName')}
                        />
                    </div>
                )}
                <button type="submit" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save Changes</button>
            </form>
        </Modal>
    )
}
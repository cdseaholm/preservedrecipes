'use client'

import { useDataStore } from "@/context/dataStore";
import { useModalStore } from "@/context/modalStore";
import { ICommunity } from "@/models/types/community/community";
import { CommunityFormType } from "@/models/types/community/community-form-type";
import { AttemptCreateCommunity } from "@/utils/apihelpers/create/create-community";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateCommunityHooks() {

    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const currCommunities = useDataStore(state => state.communities);
    const setOpenCreateCommunityModal = useModalStore(state => state.setOpenCreateCommunityModal);


    const communityForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            privacyLevel: 'public' as 'public' | 'private' | 'hidden' | 'restricted' | 'passwordProtected',
            communityPassword: '',
            description: '',
            tags: [] as string[],
        },
        validate: {
            name: (value) => (
                value.length > 100 ? 'Invalid name too long' :
                    (value === '' || value === null || value.length < 1) ? 'Name cannot be empty' :
                        null
            ),
            communityPassword: (value, values) => (
                values.privacyLevel === 'passwordProtected' ?
                    (value ? (value.length < 6 ? 'Password too short' : null) : 'Password cannot be empty for private communities')
                    : null
            ),
        }
    });

    const HandleCreateCommunity = async ({ communityForm }: { communityForm: CommunityFormType }) => {
        setLoading(true);
        if (!communityForm) {
            setLoading(false);
            toast.error("Community form is not defined");
            return;
        }

        communityForm.clearErrors();

        try {

            if (!session) {
                setLoading(false);
                toast.error("You need to be signed in to make a community!");
                return;
            }

            const validation = communityForm.validate();

            if (validation && validation.hasErrors) {
                communityForm.setErrors(validation.errors);
                setLoading(false);
                toast.error("Please fix the errors in the form before submitting.");
                return;
            }

            const initialValues = communityForm.getValues();
            const communityName = initialValues.name;

            const nameTaken = currCommunities.find(community => community.name === communityName);

            if (nameTaken) {
                setLoading(false);
                communityForm.setFieldError('name', 'Name already taken');
                toast.error("Please fix the errors in the form before submitting.");
                return;
            }

            const communityType = initialValues.privacyLevel;
            const communityDescription = initialValues.description || "";
            const communityTags = initialValues.tags || [] as string[];
            const communityPassword: string = initialValues.communityPassword || "";

            const newCommunity = {
                name: communityName,
                adminIDs: [] as string[],
                description: communityDescription,
                tags: communityTags,
                privacyLevel: communityType,
                communityPassword: communityPassword,
                postIDs: [] as string[],
                recipeIDs: [] as string[],
                communityMemberIDs: [] as string[],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as ICommunity;

            let creationAttempt = await AttemptCreateCommunity({ communityToAdd: newCommunity }) as { status: boolean, message: string };

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (attemptStatus === false) {
                setLoading(false);
                toast.error(creationAttempt.message || "Failed to create community");
                return;
            }
            toast.success("Community created successfully!");
            setOpenCreateCommunityModal(false);
            communityForm.reset();
            communityForm.clearErrors();
            setLoading(false);

        } catch (error) {
            setLoading(false);
            toast.error("An error occurred while creating the community.");
            return;
        }
    }

    return { HandleCreateCommunity, communityForm, loading };

}
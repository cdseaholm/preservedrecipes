'use client'

import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core"
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { useCallback, useEffect, useState } from "react";
import { IPost } from "@/models/types/misc/post";
import { useForm } from "@mantine/form";
import CreatePostForm from "@/components/forms/post/create-post-form";
import { useUserStore } from "@/context/userStore";
import { useDataStore } from "@/context/dataStore";
import { IRecipe } from "@/models/types/recipes/recipe";
import { AttemptCreatePost } from "@/utils/apihelpers/create/create-post-helper";
import { useCommunityStore } from "@/context/communityStore";
import { useWindowSizes } from "@/context/width-height-store";


export default function CreatePostModal({
    openPostModal,
}: {
    openPostModal: IPost | null;
}) {

    //Globals
    const setOpenRecipeForm = useModalStore(state => state.setOpenRecipeForm);
    const recipeForPostAndPostBackup = useDataStore(state => state.recipeForPostAndPostBackup) as { recipe: IRecipe | null, backupPost: IPost | null } | null;
    const setRecipeForPostAndPostBackup = useDataStore(state => state.setRecipeForPostAndPostBackup);
    const setOpenPostModal = useModalStore(state => state.setOpenPostModal);
    const { width } = useWindowSizes();
    const [loading, setLoading] = useState(false);
    const userRecipes = useUserStore(state => state.userRecipes);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const currCommunity = useCommunityStore(state => state.community);

    const getInitialPostValues = useCallback((): IPost => {
        // Priority 1: Backup post (user was creating a recipe)
        if (recipeForPostAndPostBackup?.backupPost) {
            return recipeForPostAndPostBackup.backupPost;
        }
        // Priority 2: Editing existing post
        if (openPostModal) {
            return openPostModal;
        }
        // Priority 3: Empty new post
        return {
            _id: '',
            name: '',
            type: null,
            image: '',
            creatorID: '',
            relatedToID: currCommunity ? currCommunity._id : null,
            relatedToType: currCommunity ? 'community' : null,
            commentIDs: [] as string[],
            ratingIDs: [] as string[],
            category: [] as string[],
            content: [] as string[],
            createdAt: '',
            updatedAt: '',
        };
    }, [recipeForPostAndPostBackup, currCommunity, openPostModal]);

    const postForm = useForm({
        mode: 'uncontrolled',
        initialValues: getInitialPostValues(),
        validate: {
            name: (value) => {
                if (!value || value.length < 3) {
                    return 'Post name must be at least 3 characters';
                }
                return null;
            },
            content: (value) => {
                if (!value || !Array.isArray(value) || value.length === 0) {
                    return 'Post content cannot be empty';
                }
                return null;
            },
            type: (value) => {
                if (!value || !['image', 'text', 'recipe', 'video', 'link', 'other'].includes(value)) {
                    return 'Post type is required';
                }
                return null;
            }
        }
    });

    const attemptCreatePost = async () => {

        setLoading(true);
        postForm.clearErrors();
        const valid = postForm.validate();
        if (valid.hasErrors) {
            postForm.setErrors(valid.errors);
            setLoading(false);
            return;
        }
        try {

            const relatedID = currCommunity ? currCommunity._id : null;

            if (!relatedID) {
                toast.error("Error determining post's related community. Please try again.");
                setLoading(false);
                return;
            }

            const postToPass = {
                ...postForm.getValues(),
                relatedToID: relatedID,
                relatedToType: 'community',
            } as IPost;

            const attempt = await AttemptCreatePost({ post: postToPass });
            if (!attempt) {
                toast.error("Error creating post. Please try again.");
                setLoading(false);
                return;
            }

            if (attempt.status === false || !attempt.status) {
                toast.error(`Error creating post: ${attempt.message}`);
                setLoading(false);
                return;
            }

            toast.success("Post created successfully!");
            setLoading(false);
            setOpenPostModal(null);
            setRecipeForPostAndPostBackup({ recipe: null, backupPost: null });
            setOpenRecipeForm({
                type: '',
                recipe: null,
                from: null,
                fromId: null
            });
            postForm.clearErrors();
            postForm.reset();
            return;


        } catch (error) {
            console.log("Error creating post:", error);
            toast.error("Error creating post. Please try again.");
            setLoading(false);
            return;
        }

    }

    const handleCancel = () => {
        setLoading(false);
        resetZoom(width, false);
        setOpenPostModal(null);
        setRecipeForPostAndPostBackup({ recipe: null, backupPost: null });
        setOpenRecipeForm({
            type: '',
            recipe: null,
            from: null,
            fromId: null
        });
        toast.info("Cancelled Creating Post");
        postForm.clearErrors();
        postForm.reset();
    }

    // ✅ Reset form when modal opens
    useEffect(() => {
        if (openPostModal) {
            const newValues = getInitialPostValues();
            postForm.setValues(newValues);
            postForm.resetDirty();
            // Clear backup after using it
            if (recipeForPostAndPostBackup?.backupPost) {
                setRecipeForPostAndPostBackup({
                    recipe: recipeForPostAndPostBackup.recipe,
                    backupPost: null
                });
            }
        }
    }, [getInitialPostValues, postForm, recipeForPostAndPostBackup, recipeForPostAndPostBackup?.backupPost, recipeForPostAndPostBackup?.recipe, setRecipeForPostAndPostBackup, openPostModal]);

    return (
        <Modal
            opened={openPostModal !== null}
            onClose={handleCancel}
            title="Create a Post"
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                className: 'drop-shadow-xl'
            }}
            removeScrollProps={{ allowPinchZoom: true }}
            lockScroll={false}
            size={'80%'}
            closeOnClickOutside={true}
            closeOnEscape={true}
        >
            <LoadingOverlayComponent visible={loading} />
            {/* ✅ Force remount with key when modal opens */}
            {openPostModal && (
                <CreatePostForm
                    key={openPostModal._id || 'new-post'}
                    postForm={postForm}
                    userRecipes={userRecipes}
                    recipeForPost={recipeForPostAndPostBackup?.recipe || null}
                    handleCreatePost={attemptCreatePost}
                />
            )}
        </Modal>
    )
}
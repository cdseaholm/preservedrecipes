// components/modals/recipe/recipe-drawer.tsx
'use client'

import { Drawer, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useModalStore } from "@/context/modalStore";
import { useDataStore } from "@/context/dataStore";
import RecipeForm from "@/components/forms/recipe/recipeForm";
import { RecipeFormContextType } from "@/models/types/recipes/recipe";
import { useRecipeForm } from "@/app/(content)/u/recipes/hooks/recipe-form-hooks";
import { useStateStore } from "@/context/stateStore";
import { toast } from "sonner";
import { useUserStore } from "@/context/userStore";
import { useWindowSizes } from "@/context/width-height-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useEnsureData } from "@/components/hooks/data/useEnsureData";
import { UploadedRecipeImage } from "@/components/buttons/uploadThing-button";
import { DeleteUploadThingFiles } from "@/utils/server-actions/uploadthing/delete-files";

export default function RecipeDrawer({ openRecipeForm }: { openRecipeForm: RecipeFormContextType }) {

    const setOpenRecipeForm = useModalStore(state => state.setOpenRecipeForm);
    const ingredientNames = useDataStore(state => state.ingredientNames);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();
    const userInfo = useUserStore(state => state.userInfo);
    const pathname = usePathname();
    const router = useRouter();
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [uploadedImageKeys, setUploadedImageKeys] = useState<string[]>([]);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const transitionDuration = 220;
    const { ensureReady: ensureIngredients } = useEnsureData('ingredients');

    const {
        form,
        loading,
        attemptedToCreate,
        handleCreate,
        handleUpdate,
        handleDelete,
        favoriteRecipe,
        isFavorited,
    } = useRecipeForm({ initialRecipe: openRecipeForm.recipe, userInfo: userInfo });

    const isCreateMode = openRecipeForm.type === 'create';
    const isEditMode = openRecipeForm.type === 'edit';

    useEffect(() => {
        if (openRecipeForm.type === '') {
            setDrawerOpened(false);
            return;
        }

        const frameId = requestAnimationFrame(() => {
            setDrawerOpened(true);
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [openRecipeForm.type]);

    useEffect(() => {
        if (openRecipeForm.type !== '') {
            ensureIngredients();
        }
    }, [ensureIngredients, openRecipeForm.type]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const clearRecipeForm = () => {
        setOpenRecipeForm({ type: '', recipe: null, from: null, fromId: null });
    };

    const deleteUploadThingKeys = async (keys: string[]) => {
        const keysToDelete = Array.from(new Set(keys.filter(Boolean)));

        if (keysToDelete.length === 0) {
            return;
        }

        const result = await DeleteUploadThingFiles(keysToDelete);
        if (!result.success) {
            toast.warning('Some unused recipe photos could not be removed yet');
        }
    };

    const cleanupUnusedSessionUploads = async (savedImageKey: string) => {
        const unusedUploadedKeys = uploadedImageKeys.filter(key => key !== savedImageKey);
        await deleteUploadThingKeys(unusedUploadedKeys);
        setUploadedImageKeys([]);
    };

    const cleanupCancelledSessionUploads = async () => {
        await deleteUploadThingKeys(uploadedImageKeys);
        setUploadedImageKeys([]);
    };

    const handleImageUpload = (file: UploadedRecipeImage) => {
        setUploadedImageKeys(currentKeys => Array.from(new Set([...currentKeys, file.key])));
        form.setFieldValue('image', file.url);
        form.setFieldValue('imageKey', file.key);
    };

    const closeDrawer = ({ resetForm = false, notify = false, cleanupPendingUploads = false, afterClose }: { resetForm?: boolean, notify?: boolean, cleanupPendingUploads?: boolean, afterClose?: () => void } = {}) => {
        setDrawerOpened(false);

        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }

        closeTimeoutRef.current = setTimeout(() => {
            if (cleanupPendingUploads) {
                cleanupCancelledSessionUploads();
            }

            clearRecipeForm();

            if (resetForm) {
                form.reset();
                resetZoom(width, false);
            }

            if (notify) {
                toast.info("Cancelled");
            }

            afterClose?.();
        }, transitionDuration);
    };

    const onSubmit = async () => {
        const route = isEditMode ? pathname : '/u/recipes';
        const savedImageKey = form.getValues().imageKey || '';

        if (isCreateMode) {
            const result = await handleCreate('/u/recipes');
            if (result.success) {
                await cleanupUnusedSessionUploads(savedImageKey);
                closeDrawer();
            }
        } else if (isEditMode && openRecipeForm.recipe?._id) {
            const result = await handleUpdate(openRecipeForm.recipe._id, route);
            if (result.success) {
                await cleanupUnusedSessionUploads(savedImageKey);
                closeDrawer();
            }
        }
    };

    const onDelete = async () => {
        if (openRecipeForm.recipe?._id) {
            const result = await handleDelete(openRecipeForm.recipe._id, pathname);
            if (result.success) {
                closeDrawer({ afterClose: () => router.push('/u/recipes') });
            }
        }
    };

    const handleCancel = () => {
        closeDrawer({ resetForm: true, notify: true, cleanupPendingUploads: true });
    };

    return (
        <Drawer
            opened={drawerOpened}
            onClose={handleCancel}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="min(100%, 980px)"
            closeOnEscape={!loading}
            closeOnClickOutside={!loading}
            position="right"
            transitionProps={{ transition: 'slide-left', duration: transitionDuration, timingFunction: 'ease-out' }}
            withCloseButton={false}
            styles={{
                content: {
                    minHeight: '100dvh',
                    background: 'var(--mainBack)',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                    overflow: 'hidden',
                },
                body: {
                    backgroundColor: 'var(--mainBack)',
                    minHeight: '100dvh',
                    padding: 0,
                }
            }}
        >
            <LoadingOverlay visible={loading} />
            <ScrollArea w="100%" h="100dvh" scrollbarSize={8}>
                <RecipeForm
                    attemptedToCreate={attemptedToCreate}
                    recipeForm={form}
                    formType={openRecipeForm.type}
                    handleCancel={handleCancel}
                    handleEdit={onSubmit}
                    handleCreate={onSubmit}
                    handleDelete={onDelete}
                    ingredientNames={ingredientNames} 
                    isFavorited={isFavorited} 
                    favoriteRecipe={favoriteRecipe}
                    isSaving={loading}
                    handleImageUpload={handleImageUpload}
                />
            </ScrollArea>
        </Drawer>
    );
}

// components/modals/recipe/recipe-drawer.tsx
'use client'

import { Drawer, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useModalStore } from "@/context/modalStore";
import { useDataStore } from "@/context/dataStore";
import RecipeForm from "@/components/forms/recipe/recipeForm";
import { RecipeFormContextType } from "@/models/types/recipes/recipe";
import { useRecipeForm } from "@/components/hooks/recipes/recipe-form-hooks";
import { useStateStore } from "@/context/stateStore";
import { toast } from "sonner";
import { useUserStore } from "@/context/userStore";
import { useWindowSizes } from "@/context/width-height-store";

export default function RecipeDrawer({ openRecipeForm }: { openRecipeForm: RecipeFormContextType }) {

    const setOpenRecipeForm = useModalStore(state => state.setOpenRecipeForm);
    const ingredientNames = useDataStore(state => state.ingredientNames);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();
    const userInfo = useUserStore(state => state.userInfo);

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

    const onSubmit = async () => {
        if (isCreateMode) {
            const result = await handleCreate('/u/recipes');
            if (result.success) {
                setOpenRecipeForm({ type: '', recipe: null, from: null, fromId: null });
            }
        } else if (isEditMode && openRecipeForm.recipe?._id) {
            const result = await handleUpdate(openRecipeForm.recipe._id, '/u/recipes');
            if (result.success) {
                setOpenRecipeForm({ type: '', recipe: null, from: null, fromId: null });
            }
        }
    };

    const onDelete = async () => {
        if (openRecipeForm.recipe?._id) {
            const result = await handleDelete(openRecipeForm.recipe._id, '/u/recipes');
            if (result.success) {
                setOpenRecipeForm({ type: '', recipe: null, from: null, fromId: null });
            }
        }
    };

    const handleCancel = () => {
        setOpenRecipeForm({ type: '', recipe: null, from: null, fromId: null });
        form.reset();
        resetZoom(width, false);
        toast.info("Cancelled");
    };

    return (
        <Drawer
            opened={openRecipeForm.type !== ''}
            onClose={handleCancel}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="100%"
            closeOnEscape={!loading}
            closeOnClickOutside={!loading}
            transitionProps={{ transition: 'slide-up' }}
            withCloseButton={false}
            styles={{
                content: {
                    backgroundImage: 'url(/images/old-paper.jpg)',
                    backgroundSize: 'cover',
                    minHeight: '100dvh',
                    marginTop: '5dvh',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                },
                body: {
                    backgroundColor: 'rgba(250, 244, 232, .7)',
                    minHeight: '95dvh',
                }
            }}
        >
            <LoadingOverlay visible={loading} />
            <ScrollArea w="100%" h="95dvh" scrollbarSize={10}>
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
                />
            </ScrollArea>
        </Drawer>
    );
}
// components/modals/recipe/recipe-drawer.tsx
'use client'

import { Modal, Select } from "@mantine/core";
import { useStateStore } from "@/context/stateStore";
import { toast } from "sonner";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { IRecipe } from "@/models/types/recipes/recipe";
import { useWindowSizes } from "@/context/width-height-store";

export default function ChooseRecipeModal({ open, userRecipes, handleAddRecipe, handleCloseRecipeChoose, modalLoading }: { open: boolean, userRecipes: IRecipe[], handleAddRecipe: (recipe: IRecipe) => void, handleCloseRecipeChoose: () => void, modalLoading: boolean }) {

    const resetZoom = useStateStore(state => state.handleZoomReset);
    const { width } = useWindowSizes();

    const handleCancel = () => {
        resetZoom(width, false);
        toast.info("Cancelled");
        handleCloseRecipeChoose();
    };

    return (
        <Modal opened={open} onClose={handleCancel} title="Enter Family Members to add" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>
            <LoadingOverlayComponent visible={modalLoading} />
            <Select
                label="Select a recipe to add to your family"
                placeholder="Pick a Recipe to add"
                data={userRecipes.map(recipe => ({ value: recipe._id, label: recipe.name }))}
                searchable
                onChange={(value) => {
                    handleAddRecipe(userRecipes.find(recipe => recipe._id === value) as IRecipe);
                }}
            />
        </Modal>
    );
}
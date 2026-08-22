import { useState, useEffect, useCallback } from 'react';
import { ensureDataLoaded } from '@/utils/data/optimized-init';
import { useDataStore } from '@/context/dataStore';
import { useFamilyStore } from '@/context/familyStore';
import { useUserStore } from '@/context/userStore';

type DataType = 'ingredients' | 'recipes' | 'family' | 'suggestions';

/**
 * Hook to ensure specific data is loaded before user interactions
 * Returns isReady status and a manual trigger function
 * 
 * @example
 * const { isReady, ensureReady } = useEnsureData('ingredients');
 * 
 * const handleOpenRecipeModal = async () => {
 *   await ensureReady(); // Loads ingredients if not already loaded
 *   openModal();
 * }
 */
export function useEnsureData(dataType: DataType, autoLoad = false) {
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const ingredientsLoaded = useDataStore(state => state.ingredientNames.length > 0);
    const recipesLoaded = useUserStore(state => state.userRecipes.length > 0);
    const familyLoaded = useFamilyStore(state => !!state.family);
    const suggestionsLoaded = useUserStore(state => state.inquiries.length > 0);
    const hasData = dataType === 'ingredients'
        ? ingredientsLoaded
        : dataType === 'recipes'
            ? recipesLoaded
            : dataType === 'family'
                ? familyLoaded
                : suggestionsLoaded;

    const ensureReady = useCallback(async () => {
        if (isReady || hasData) {
            setIsReady(true);
            return;
        }
        
        setIsLoading(true);
        try {
            await ensureDataLoaded(dataType);
            setIsReady(true);
        } catch (error) {
            console.error(`Error ensuring ${dataType} data:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [hasData, isReady, dataType]);

    useEffect(() => {
        if (autoLoad) {
            ensureReady();
        }
    }, [autoLoad, ensureReady]);

    useEffect(() => {
        if (hasData) {
            setIsReady(true);
        }
    }, [hasData]);

    return { isReady, isLoading, ensureReady };
}

/**
 * Hook to check if data is already available without loading
 * Useful for conditional rendering
 */
export function useDataAvailable(dataType: DataType) {
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        switch (dataType) {
            case 'ingredients':
                setIsAvailable(useDataStore.getState().ingredientNames.length > 0);
                break;
            case 'recipes':
                setIsAvailable(useUserStore.getState().userRecipes.length > 0);
                break;
            case 'family':
                setIsAvailable(!!useFamilyStore.getState().family);
                break;
            case 'suggestions':
                setIsAvailable(useUserStore.getState().inquiries.length > 0);
                break;
        }
    }, [dataType]);

    return isAvailable;
}

import { useState, useEffect } from 'react';
import { ensureDataLoaded } from '@/utils/data/optimized-init';

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
    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL || '';

    const ensureReady = async () => {
        if (isReady) return;
        
        setIsLoading(true);
        try {
            await ensureDataLoaded(urlToUse, dataType);
            setIsReady(true);
        } catch (error) {
            console.error(`Error ensuring ${dataType} data:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoLoad) {
            ensureReady();
        }
    }, [autoLoad]);

    return { isReady, isLoading, ensureReady };
}

/**
 * Hook to check if data is already available without loading
 * Useful for conditional rendering
 */
export function useDataAvailable(dataType: DataType) {
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        // Check if data exists in store
        const checkDataAvailability = () => {
            switch (dataType) {
                case 'ingredients':
                    return import('@/context/dataStore').then(({ useDataStore }) => {
                        const ingredients = useDataStore.getState().ingredientNames || [];
                        return ingredients.length > 0;
                    });
                case 'recipes':
                    return import('@/context/userStore').then(({ useUserStore }) => {
                        //not entirely sure if this is right, was using dataStore previously but I am trying to reduce zustand usage
                        return useUserStore.getState().userRecipes.length > 0;
                    });
                case 'family':
                    return import('@/context/familyStore').then(({ useFamilyStore }) => {
                        return !!useFamilyStore.getState().family;
                    });
                case 'suggestions':
                    return import('@/context/userStore').then(({ useUserStore }) => {
                        return useUserStore.getState().setInquiries.length > 0;
                    });
                default:
                    return Promise.resolve(false);
            }
        };

        checkDataAvailability().then(setIsAvailable);
    }, [dataType]);

    return isAvailable;
}

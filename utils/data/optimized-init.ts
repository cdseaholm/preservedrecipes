
import { useDataStore } from "@/context/dataStore";
import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family/family";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IRecipe } from "@/models/types/recipes/recipe";

/**
 * Phase 1: Critical user data only
 * Loads immediately after session is authenticated
 */
export async function initCriticalUserData(urlToUse: string) {
    try {
        const userDataRes = await fetch(`${urlToUse}/api/user/get`);

        if (!userDataRes) {
            throw new Error('Failed to fetch user data');
        }

        const userDataJson = await userDataRes.json();

        if (!userDataJson || !userDataJson.userInfo) {
            throw new Error('Invalid user data');
        }

        const user = userDataJson.userInfo;
        useUserStore.getState().setUserInfo(user);

        return user;
    } catch (error) {
        console.error('Error initializing critical user data:', error);
        throw error;
    }
}

// /**
//  * Phase 2: Page-specific data
//  * Load only what's needed for the current route
//  * Checks Zustand cache first - only fetches if data not available
//  */
// export async function initPageData(route: string) {
//     try {
//         const routeDataMap: Record<string, () => Promise<void>> = {
//             '/family': async () => {
//                 // Family dashboard - load family data (only if not already in store)
//                 if (!useFamilyStore.getState().family) {
//                     const familyData = await GetItemHandler('family/get');
//                     if (familyData.status && familyData.dataFetched?.family) {
//                         useFamilyStore.getState().setFamily(familyData.dataFetched.family);
//                     }
//                 }
//             },
//             '/family/recipes': async () => {
//                 // Family recipes - load family data (only if not already in store)
//                 if (!useFamilyStore.getState().family) {
//                     const familyData = await GetItemHandler('family/get');
//                     if (familyData.status && familyData.dataFetched?.family) {
//                         const fam = familyData.dataFetched.family;
//                         useFamilyStore.getState().setFamily(fam);
//                     } else {
//                         console.log('No family data to set in store', familyData.dataFetched);
//                     }
//                 }
//             },
//             '/family/members': async () => {
//                 // Family members - load family data (only if not already in store)
//                 // Might need to do a second fetch for members
//                 if (!useFamilyStore.getState().family || useFamilyStore.getState().family === {} as IFamily) {
//                     const familyData = await GetItemHandler('family/get');
//                     if (familyData.status && familyData.dataFetched?.family) {
//                         useFamilyStore.getState().setFamily(familyData.dataFetched.family);
//                     }
//                 } else {
//                     console.log('Family already in store, skipping fetch', useFamilyStore.getState().family);
//                 }
//             },
//             '/family/settings': async () => {
//                 // Family settings - load family data (only if not already in store)
//                 if (!useFamilyStore.getState().family) {
//                     const familyData = await GetItemHandler('family/get');
//                     if (familyData.status && familyData.dataFetched?.family) {
//                         useFamilyStore.getState().setFamily(familyData.dataFetched.family);
//                     }
//                 }
//             },
//             '/recipes': async () => {

//                 // Recipes page - load recipes data (only if not already in store)
//                 if (useUserStore.getState().re.length === 0) {
//                     const recipesData = await GetItemHandler('recipe/get');
//                     if (recipesData.status && recipesData.dataFetched?.recipes) {
//                         useUserStore.getState().setUserRecipes(recipesData.dataFetched.recipes);
//                     } else {
//                         console.log('No recipes data found for this user to set in store', recipesData.dataFetched);
//                     }
//                 }
//             },
//             '/profile/inquiries': async () => {
//                 // Inquiries - load inquiries data (only if not already in store)
//                 if (useUserStore.getState().inquiries.length === 0) {
//                     const inqsData = await GetItemHandler('inquiry/get');
//                     if (inqsData.status && inqsData.dataFetched?.inquiries) {
//                         useUserStore.getState().setInquiries(inqsData.dataFetched.inquiries as IInquiry[]);
//                     }
//                 }
//             },
//             '/profile/settings': async () => {
//                 // Profile settings - load inquiries data (only if not already in store)
//                 if (useUserStore.getState().inquiries.length === 0) {
//                     //probably won't need api fetch since its a list of buttons but keeping for consistency
//                     //const settingsRes = await fetch(`${urlToUse}/api/settings/get`);
//                     //const settingsData = await settingsRes.json();
//                     console.log('Settings data fetched but not used'); //placeholder action

//                 }
//             },
//             '/profile/history': async () => {
//                 // Profile history - load inquiries data (only if not already in store)
//                 if (useUserStore.getState().inquiries.length === 0) {
//                     //adding this as a stand in until history api is made
//                     //const historyRes = await fetch(`${urlToUse}/api/history/get`);
//                     //const historyData = await historyRes.json();
//                     console.log('History data loaded'); //placeholder action

//                 }
//             },
//             '/profile': async () => {
//                 // Profile main page - load suggestions data (only if not already in store)
//                 if (!useUserStore.getState().userInfo) {
//                     //adding this as a stand in until more specifics about the data needed here for the user api is made
//                     const userData = await GetItemHandler('user/get');
//                     if (userData.status && userData.dataFetched) {
//                         useUserStore.getState().setUserInfo(userData.dataFetched.userInfo as IUser);
//                     }
//                 }
//             },
//             '/communities': async () => {
//                 // Communities main page - load main posts
//                 if (useDataStore.getState().communities.length === 0) {
//                     const communitiesData = await GetItemHandler('community/get');
//                     if (communitiesData.status && communitiesData.dataFetched?.communities) {
//                         useDataStore.getState().setCommunities(communitiesData.dataFetched.communities as ICommunity[]);
//                     }
//                 }
//             },
//             '/communities/user': async () => {
//                 // User's communities - load main posts
//                 if (useUserStore.getState().userCommunities.length === 0) {
//                     let communities = [] as ICommunity[];
//                     if (useDataStore.getState().communities.length === 0) {
//                         const communitiesData = await GetItemHandler('community/get');
//                         if (communitiesData.status && communitiesData.dataFetched?.communities) {
//                             useDataStore.getState().setCommunities(communitiesData.dataFetched.communities as ICommunity[]);
//                             communities = communitiesData.dataFetched.communities;
//                         }
//                     } else {
//                         communities = useDataStore.getState().communities;
//                     }
//                     const userData = await GetItemHandler('user/get');
//                     if (userData.status && userData.dataFetched) {
//                         if (userData.dataFetched.userInfo) {
//                             const userCommunities = communities.filter((comm) => userData.dataFetched.userInfo.communityIDs.includes(comm._id));
//                             useUserStore.getState().setUserCommunities(userCommunities as ICommunity[]);
//                         }
//                     }
//                 }
//             },
//             '/communities/[id]': async () => {
//                 // Specific community page - load main posts
//                 if (useDataStore.getState().communities.length === 0) {
//                     const communitiesData = await GetItemHandler('community/get');
//                     if (communitiesData.status && communitiesData.dataFetched?.communities) {
//                         useDataStore.getState().setCommunities(communitiesData.dataFetched.communities as ICommunity[]);
//                     }
//                 }
//             },
//             // Add more route-specific loaders as needed
//         };

//         // Find matching route (check if current route starts with any key)
//         const matchedRoute = Object.keys(routeDataMap).find(key => route.startsWith(key));
        
//         if (matchedRoute) {
//             await routeDataMap[matchedRoute]();
//         } else {
//             console.log('No specific data to load for route:', route);
//         }
//     } catch (error) {
//         console.error('Error initializing page data:', error);
//         // Don't throw - this is non-critical
//     }
// }

// /**
//  * Phase 3: Background prefetch
//  * Load remaining data silently in the background
//  */
// export async function prefetchRemainingData(urlToUse: string, userFamilyID?: string) {
//     try {
//         // Use requestIdleCallback for non-blocking background loading
//         const runPrefetch = () => {
//             Promise.all([
//                 // Prefetch ingredients (useful for recipe creation)
//                 fetch(`${urlToUse}/api/ingredient/get`)
//                     .then(res => res.json())
//                     .then(data => {
//                         if (data?.ingredients) {
//                             useDataStore.getState().setIngredientNames(data.ingredients as IIngredient[]);
//                         }
//                     }),

//                 // Prefetch inquiries
//                 fetch(`${urlToUse}/api/inquiry/get`)
//                     .then(res => res.json())
//                     .then(data => {
//                         if (data?.inquiries) {
//                             useUserStore.getState().setInquiries(data.inquiries as IInquiry[]);
//                         }
//                     }),

//                 // Prefetch family data if user has a family and not already loaded
//                 ...(userFamilyID && !useFamilyStore.getState().family ? [
//                     fetch(`${urlToUse}/api/family/get`)
//                         .then(res => res.json())
//                         .then(data => {
//                             if (data?.family) {
//                                 useFamilyStore.getState().setFamily(data.family as IFamily);
//                             }
//                         })
//                 ] : []),

//                 // Prefetch recipes if not already loaded
//                 ...(!useDataStore.getState().recipes.length ? [
//                     fetch(`${urlToUse}/api/recipe/get`)
//                         .then(res => res.json())
//                         .then(data => {
//                             if (data?.recipes) {
//                                 useDataStore.getState().setRecipes(data.recipes as IRecipe[]);
//                             }
//                         })
//                 ] : [])
//             ]).catch(error => {
//                 console.error('Error prefetching data:', error);
//                 // Silently fail - this is non-critical background loading
//             });
//         };

//         // Use requestIdleCallback if available, otherwise setTimeout
//         if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
//             window.requestIdleCallback(runPrefetch, { timeout: 2000 });
//         } else {
//             setTimeout(runPrefetch, 1000);
//         }
//     } catch (error) {
//         console.error('Error setting up prefetch:', error);
//     }
// }

/**
 * Lazy loader for on-demand data fetching
 * Call this before user interactions that require specific data
 */
export async function ensureDataLoaded(urlToUse: string, dataType: 'ingredients' | 'recipes' | 'family' | 'suggestions') {
    const loaders = {
        ingredients: async () => {
            const currentIngredients = useDataStore.getState().ingredientNames || [];
            if (currentIngredients.length === 0) {
                const res = await fetch(`${urlToUse}/api/ingredient/get`);
                const data = await res.json();
                if (data?.ingredients) {
                    useDataStore.getState().setIngredientNames(data.ingredients as IIngredient[]);
                }
            }
        },
        recipes: async () => {
            if (useUserStore.getState().userRecipes.length === 0) {
                const res = await fetch(`${urlToUse}/api/recipe/get`);
                const data = await res.json();
                if (data?.recipes) {
                    useUserStore.getState().setUserRecipes(data.recipes as IRecipe[]);
                }
            }
        },
        family: async () => {
            if (!useFamilyStore.getState().family) {
                const res = await fetch(`${urlToUse}/api/family/get`);
                const data = await res.json();
                if (data?.family) {
                    useFamilyStore.getState().setFamily(data.family as IFamily);
                }
            }
        },
        suggestions: async () => {
            if (useUserStore.getState().inquiries.length === 0) {
                const res = await fetch(`${urlToUse}/api/inquiry/get`);
                const data = await res.json();
                if (data?.inquiries) {
                    useUserStore.getState().setInquiries(data.inquiries as IInquiry[]);
                }
            }
        }
    };

    await loaders[dataType]();
}

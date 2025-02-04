import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

export async function fetchData({ endpoint }: { endpoint: string }) {
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        next: {
            revalidate: 6000
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();
    return data;
    
}

export async function InitializeUserData() {

    try {
        const [userData, recipeData, familyData, suggestionData] = await Promise.all([
            fetchData({ endpoint: '/api/user/get' }),
            fetchData({ endpoint: '/api/recipe/get' }),
            fetchData({ endpoint: '/api/family/get' }),
            fetchData({ endpoint: '/api/suggestion/get' })
            // fetchData('/api/community/get'),
            // fetchData('/api/family/members/get'),
            // fetchData('/api/family/recipes/get')
        ]);

        //const communities = [] as ICommunity[];

        const userStore = useUserStore.getState();
        const familyStore = useFamilyStore.getState();

        userStore.setUserInfo(userData.userInfo as IUser);
        userStore.setUserRecipes(recipeData.recipes as IRecipe[]);
        familyStore.setFamily(familyData.family as IFamily);
        useUserStore.getState().setSuggestions(suggestionData.suggestions)

        return { status: true, message: 'Success' };


    } catch (error: any) {
        return { status: false, message: 'Error initializing data' };
    }
}
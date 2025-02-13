import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

export async function fetchData({ endpoint }: { endpoint: string }, headers: HeadersInit) {
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            ...headers,
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

export async function InitializeUserData({ email }: { email: string }, headers: HeadersInit) {



    try {
        const [userData, recipeData, familyData, suggestionData] = await Promise.all([
            fetchData({ endpoint: '/api/user/get' }, headers),
            fetchData({ endpoint: '/api/recipe/get' }, headers),
            fetchData({ endpoint: '/api/family/get' }, headers),
            fetchData({ endpoint: '/api/suggestion/get' }, headers)
        ]);

        const userStore = useUserStore.getState();
        const familyStore = useFamilyStore.getState();

        if (userData.status === 200) {
            userStore.setUserInfo(userData.userInfo as IUser);
        }

        if (recipeData.status === 200) {
            userStore.setUserRecipes(recipeData.recipes as IRecipe[]);
        }

        if (familyData.status === 200) {
            familyStore.setFamily(familyData.family as IFamily);
        }

        if (suggestionData.status === 200) {
            useUserStore.getState().setSuggestions(suggestionData.suggestions);
        }

        if (email === 'cdseaholm@gmail.com') {
            return { status: true, message: 'Success', admin: true };
        }

        return { status: true, message: 'Success', admin: false };
    } catch (error: any) {
        return { status: false, message: 'Error initializing data', admin: false };
    }
}
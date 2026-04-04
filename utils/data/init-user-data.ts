import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";

export async function InitUserData(urlToUse: string) {

    try {
        const [userDataRes, familyData] = await Promise.all([
            fetch(`${urlToUse}/api/user/get`),
            fetch(`${urlToUse}/api/family/get`)
        ]);
        
        if (!userDataRes || !familyData) {
            throw new Error('Failed to fetch user data');
        }
        
        const userDataJson = await userDataRes.json();
        //console.log('User Data Response:', userDataJson); // Debug log
        
        if (!userDataJson || !userDataJson.userInfo) {
            throw new Error('Invalid user data');
        }
        
        const user = userDataJson.userInfo;
        useUserStore.getState().setUserInfo(user);
        
        const familyDataJson = await familyData.json();
        //console.log('Family Data Response:', familyDataJson); // Debug log
        
        if (!familyDataJson || !familyDataJson.family) {
            throw new Error('Invalid family data');
        }
        
        const family = familyDataJson.family;
        useFamilyStore.getState().setFamily(family);
    } catch (error) {
        console.error('Error initializing user data:', error);
        return;
    }
}
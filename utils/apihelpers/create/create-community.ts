import { useDataStore } from "@/context/dataStore";
import { useUserStore } from "@/context/userStore";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { readApiResponse } from "../api-response";



export async function AttemptCreateCommunity({ communityToAdd }: { communityToAdd: ICommunity }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: 'App URL is not configured' };
    }

    if (!communityToAdd) {
        return { status: false, message: 'Community data is required' };
    }

    if (communityToAdd.privacyLevel === 'passwordProtected' && (!communityToAdd.communityPassword || communityToAdd.communityPassword === '')) {
        return { status: false, message: 'Password protected communities must have a password' };
    }

    const communityPassed = {
        ...communityToAdd,
        communityPassword: communityToAdd.privacyLevel === 'passwordProtected'
            ? communityToAdd.communityPassword
            : '',
    };

    try {
        const res = await fetch(`${urlToUse}/api/community/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ communityPassed: communityPassed })
        });

        const apiResponse = await readApiResponse<{ communityReturned?: ICommunity }>(res, 'Failed to create community');
        if (!apiResponse.status || !apiResponse.data) return { status: false, message: apiResponse.message };

        const data = apiResponse.data;
        const newCommunity = data.communityReturned as ICommunity;
        if (!newCommunity) {
            return { status: false, message: `No community returned` };
        }
        const currCommunities = useDataStore.getState().communities as ICommunity[];
        useDataStore.getState().setCommunities([...currCommunities, newCommunity]);
        const userInfo = useUserStore.getState().userInfo;

        const newCommunityIDs = [
            ...userInfo.communityIDs,
            newCommunity._id.toString()
        ] as string[];
        const newUserInfo = {
            ...userInfo,
            communityIDs: newCommunityIDs,
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed to create community` };
    }
}

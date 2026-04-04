import { useDataStore } from "@/context/dataStore";
import { useUserStore } from "@/context/userStore";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { SaltAndHashPassword } from "@/utils/userHelpers/saltAndHash";



export async function AttemptCreateCommunity({ communityToAdd }: { communityToAdd: ICommunity }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: 'Failed Creation, No URL' };
    }

    if (!communityToAdd) {
        return { status: false, message: 'Failed Creation, No Community Data' };
    }

    if (communityToAdd.privacyLevel === 'private' && (!communityToAdd.communityPassword || communityToAdd.communityPassword === '')) {
        return { status: false, message: 'Failed Creation, Private communities must have a password' };
    }

    const saltedPassword = await SaltAndHashPassword(communityToAdd.communityPassword as string);
    const communityPassed = {
        ...communityToAdd,
        communityPassword: saltedPassword,
    };

    try {
        const res = await fetch(`${urlToUse}/api/community/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ communityPassed: communityPassed })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        if (data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data.message}` };
        }
        const newCommunity = data.communityReturned as ICommunity;
        if (!newCommunity) {
            return { status: false, message: `Failed Creation, No community returned` };
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
        return { status: false, message: `Failed creation` };
    }
}
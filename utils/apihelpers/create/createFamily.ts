import { FamilyFormType } from "@/components/forms/familyForm";
import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IUser } from "@/models/types/user";


export async function AttemptCreateFamily({ familyToAdd }: { familyToAdd: FamilyFormType }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    try {
        const res = await fetch(`${urlToUse}/api/family/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ familyPassed: familyToAdd })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => {
            console.log('Family creation rejected')
        });

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        useFamilyStore.getState().setFamily(data.familyReturned as IFamily);
        const userInfo = useUserStore.getState().userInfo;
        const newUserInfo = {
            ...userInfo,
            userFamilyID: data.familyReturned._id.toString(),
        } as IUser;
        useUserStore.getState().setUserInfo(newUserInfo);

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}
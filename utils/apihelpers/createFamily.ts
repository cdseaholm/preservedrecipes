import { IFamily } from "@/models/types/family";
import { FamilyCreation } from "@/models/types/inAppCreations/familyCreation";
import { IUserFamily } from "@/models/types/userFamily";


export async function AttemptCreateFamily({ familyToAdd }: { familyToAdd: FamilyCreation }) {

    const urlToUse = process.env.BASE_URL ? process.env.BASE_URL as string : '';

    try {
        const res = await fetch(`${urlToUse}/api/family/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ familyPassed: familyToAdd })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}`, newFamily: {} as IFamily, newUserFamily: {} as IUserFamily };
        }

        const data = await res.json().catch(() => {
            console.log('Family creation rejected')
        });

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response`, newFamily: {} as IFamily, newUserFamily: {} as IUserFamily };
        }

        return { status: true, message: `Created`, newFamily: data.familyReturned as IFamily, newUserFamily: data.userFamilyReturned as IUserFamily };

    } catch (error: any) {
        console.log('Creating Family error: ', error);
        return { status: false, message: `Failed creation`, newFamily: {} as IFamily, newUserFamily: {} as IUserFamily };
    }
}
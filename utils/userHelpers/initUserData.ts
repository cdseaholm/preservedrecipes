import { IUserPreferences } from "@/models/types/userPreferences";
import { IVacation } from "@/models/types/vacation";
import { User } from "next-auth";

export async function InitializeUserData(user: User) {
    if (!user) {
        return {status: false, message: 'Must be signed in', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
    }

    let id = user.email;

    if (!id) {
        return {status: false, message: 'Must be signed in', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
    }

    try {
        const res = await fetch(`/api/${id}/initData`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res || !res.ok) {
            return {status: false, message: 'Error fetching data', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
        }

        const data = await res.json();

        if (!data) {
            return {status: false, message: 'Error initializing data', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
        }

        if (data.status !== 200) {
            return {status: false, message: `${data.message}`, userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
        }

        return {status: true, message: `${data.message}`, userID: '', userPreferences: data.userPreferences as IUserPreferences, vacations: data.vacations as IVacation[]}

    } catch (error: any) {
        return {status: false, message: 'Error initializing data', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]}
    }
}
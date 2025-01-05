import { IUser } from "@/models/types/user";
import { User } from "next-auth";

export async function InitializeUserData(user: User) {
    if (!user) {
        return {status: false, message: 'Must be signed in', userInfo: {} as IUser}
    }

    let id = user.email;

    if (!id) {
        return {status: false, message: 'Must be signed in', userInfo: {} as IUser}
    }

    try {
        const res = await fetch(`/api/initData`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res || !res.ok) {
            return {status: false, message: 'Error fetching data', userInfo: {} as IUser}
        }

        const data = await res.json();

        if (!data) {
            return {status: false, message: 'Error initializing data', userInfo: {} as IUser}
        }

        if (data.status !== 200) {
            return {status: false, message: `${data.message}`, userInfo: {} as IUser}
        }

        return {status: true, message: `${data.message}`, userInfo: data.userInfo as IUser}

    } catch (error: any) {
        return {status: false, message: 'Error initializing data', userInfo: {} as IUser}
    }
}
import { User } from "next-auth";

export async function InitializeUserData(user: User) {
    if (!user) {
        return {status: false, message: 'Must be signed in', userID: ''}
    }

    let id = user.email;

    if (!id) {
        return {status: false, message: 'Must be signed in', userID: ''}
    }

    try {
        const res = await fetch(`/api/${id}/initData`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res || !res.ok) {
            return {status: false, message: 'Error fetching data', userID: ''}
        }

        const data = await res.json();

        if (!data) {
            return {status: false, message: 'Error initializing data', userID: ''}
        }

        if (data.status !== 200) {
            return {status: false, message: `${data.message}`, userID: ''}
        }

        return {status: true, message: `${data.message}`, userID: ''}

    } catch (error: any) {
        return {status: false, message: 'Error initializing data', userID: ''}
    }
}
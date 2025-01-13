import { IUser } from "@/models/types/user"
import { toast } from "sonner";
import { SaltAndHashPassword } from "./saltAndHash";

export default async function RegisterHelper({ namePassed, emailPassed, pwPassed }: { namePassed: string, emailPassed: string, pwPassed: string }) {

    const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : '';

    if (baseUrl === '') {
        return {
            status: false, newUser: {} as IUser
        };
    }

    if (!namePassed) {
        return {
            status: false, newUser: {} as IUser
        };
    }

    if (!emailPassed) {
        return {
            status: false, newUser: {} as IUser
        };
    }

    if (!pwPassed) {
        return {
            status: false, newUser: {} as IUser
        };
    }

    try {

        const saltedPW = await SaltAndHashPassword(pwPassed);

        if (!saltedPW) {
            return {
                status: false, newUser: {} as IUser
            }
        }

        const res = await fetch(`${baseUrl}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ namePassed: namePassed, emailPassed: emailPassed, saltedPW: saltedPW })
        });

        if (!res || res.status !== 200) {
            toast.error('Error registering');
            return {
                status: false, newUser: {} as IUser
            };
        }

        const data = await res.json();
        let userToReturn = {} as IUser;
        if (!data) {
            return { status: false, newUser: userToReturn };
        }

        userToReturn = data.newUser as IUser;

        return { status: true, newUser: userToReturn as IUser }

    } catch (error: any) {
        return {
            status: false, newUser: {} as IUser
        };
    }

}
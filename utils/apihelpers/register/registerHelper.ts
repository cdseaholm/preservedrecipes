import { IUser } from "@/models/types/user"
import { toast } from "sonner";
import { SaltAndHashPassword } from "../../userHelpers/saltAndHash";
import { IInvite } from "@/models/types/invite";

export default async function RegisterHelper({ namePassed, emailPassed, pwPassed, invite }: { namePassed: string, emailPassed: string, pwPassed: string, invite: IInvite | null }) {

    const baseUrl = process.env.BASE_URL ? process.env.BASE_URL as string : '';

    if (!namePassed || !emailPassed || !pwPassed || baseUrl === '') {
        console.log(namePassed)
        return {
            status: false, newUser: {} as IUser
        };
    }

    try {

        const saltedPW = await SaltAndHashPassword(pwPassed);
        console.log(saltedPW)
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
            body: JSON.stringify({ namePassed: namePassed, emailPassed: emailPassed, saltedPW: saltedPW, invite: invite })
        });

        if (!res || res.status !== 200) {
            toast.error('Error registering in help');
            console.log(res)
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
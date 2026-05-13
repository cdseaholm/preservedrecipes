import { IUser } from "@/models/types/personal/user"
import { SaltAndHashPassword } from "../../userHelpers/saltAndHash";
import { IInvite } from "@/models/types/misc/invite";
import { readApiResponse } from "../api-response";
import { normalizeEmail } from "@/lib/data-normalization";

export default async function RegisterHelper({ namePassed, emailPassed, pwPassed, invite }: { namePassed: string, emailPassed: string, pwPassed: string, invite: IInvite | null }) {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';
    const normalizedEmail = normalizeEmail(emailPassed);

    if (!namePassed || !normalizedEmail || !pwPassed || baseUrl === '') {
 
        return {
            status: false, newUser: null
        };
    }

    try {

        const saltedPW = await SaltAndHashPassword(pwPassed);
        if (!saltedPW) {
            
            return {
                status: false, newUser: null
            }
        }

        const res = await fetch(`${baseUrl}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ namePassed: namePassed, emailPassed: normalizedEmail, saltedPW: saltedPW, invite: invite })
        });

        const apiResponse = await readApiResponse<{ newUser?: IUser }>(res, 'Failed to register');
        if (!apiResponse.status || !apiResponse.data) return { status: false, newUser: null, message: apiResponse.message };

        const userToReturn = apiResponse.data.newUser as IUser;

        return { status: true, newUser: userToReturn as IUser, message: 'Registered' }

    } catch (error: any) {
        
        return {
            status: false, newUser: null, message: 'Failed to register'
        };
    }

}

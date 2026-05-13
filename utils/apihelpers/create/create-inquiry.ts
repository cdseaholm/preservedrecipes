import { IInquiry } from "@/models/types/misc/inquiry";
import { useUserStore } from "@/context/userStore";
import { readApiResponse } from "../api-response";


export async function AttemptCreateInquiry({ inquiry, email }: { inquiry: IInquiry, email: string }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (!email || email.length === 0 || email === '' || !inquiry) {
        return { status: false, message: 'Email and inquiry are required' };
    }

    try {
        const res = await fetch(`${urlToUse}/api/inquiry/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inquiryPassed: inquiry, email: email })
        });

        const apiResponse = await readApiResponse<{ returnedInquiry?: IInquiry | null }>(res, 'Failed to create inquiry');
        if (!apiResponse.status || !apiResponse.data) return { status: false, message: apiResponse.message };

        const returnedInquiry = apiResponse.data.returnedInquiry as IInquiry | null;
        const currInquiries = useUserStore.getState().inquiries || [];
        useUserStore.getState().setInquiries([returnedInquiry || inquiry, ...currInquiries]);

        return { status: true, message: `Created`, returnedInquiry };

    } catch (error: any) {
        return { status: false, message: `Failed to create inquiry` };
    }
}

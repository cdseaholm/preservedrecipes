
import { useUserStore } from "@/context/userStore";
import { IInquiry } from "@/models/types/misc/inquiry";
import { readApiResponse } from "../api-response";


export async function AttemptEditInquiry({ inquiriesToEdit }: { inquiriesToEdit: IInquiry[] }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (!inquiriesToEdit || inquiriesToEdit.length === 0) {
        return { status: false, message: 'No inquiries selected' };
    }

    try {

        const res = await fetch(`${urlToUse}/api/inquiry/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inquiriesToEdit: inquiriesToEdit })
        });

        const apiResponse = await readApiResponse<{ inquiriesReturned?: IInquiry[] }>(res, 'Failed to update inquiries');
        if (!apiResponse.status || !apiResponse.data) return { status: false, message: apiResponse.message };

        const updatedInquiries = apiResponse.data.inquiriesReturned as IInquiry[];

        if (!updatedInquiries || updatedInquiries.length === 0) {
            return { status: false, message: `No inquiries returned` };
        }

        useUserStore.getState().setInquiries([...updatedInquiries]);

        return { status: true, message: `Updated` };

    } catch (error: any) {
        return { status: false, message: `Failed to update inquiries` };
    }
}

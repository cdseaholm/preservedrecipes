
import { useUserStore } from "@/context/userStore";
import { IInquiry } from "@/models/types/misc/inquiry";


export async function AttemptEditInquiry({ inquiriesToEdit }: { inquiriesToEdit: IInquiry[] }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (!inquiriesToEdit || inquiriesToEdit.length === 0) {
        return { status: false, message: 'Failed Edit, Invalid Inquiries' };
    }

    try {

        const res = await fetch(`${urlToUse}/api/inquiry/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inquiriesToEdit: inquiriesToEdit })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        const updatedInquiries = data.inquiriesReturned as IInquiry[];

        if (!updatedInquiries || updatedInquiries.length === 0) {
            return { status: false, message: `Failed Edit, No Inquiry Returned` };
        }

        useUserStore.getState().setInquiries([...updatedInquiries]);

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}

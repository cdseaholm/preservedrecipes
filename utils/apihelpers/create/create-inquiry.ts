import { IInquiry } from "@/models/types/misc/inquiry";
import { useUserStore } from "@/context/userStore";


export async function AttemptCreateInquiry({ inquiry, email }: { inquiry: IInquiry, email: string }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (!email || email.length === 0 || email === '' || !inquiry) {
        return { status: false, message: 'Failed Creation, Invalid Email or Inquiry' };
    }

    try {
        const res = await fetch(`${urlToUse}/api/inquiry/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inquiryPassed: inquiry, email: email })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => {
            return { status: false, message: 'Failed Creation, Invalid Response' };
        });

        if (!data || data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data?.message || 'Unknown Error'}` };
        }

        const returnedInquiry = data.returnedInquiry as IInquiry | null;
        const currInquiries = useUserStore.getState().inquiries || [];
        useUserStore.getState().setInquiries([returnedInquiry || inquiry, ...currInquiries]);

        return { status: true, message: `Created`, returnedInquiry };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}

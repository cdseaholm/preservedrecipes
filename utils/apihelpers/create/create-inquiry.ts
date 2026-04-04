import { IInquiry } from "@/models/types/misc/inquiry";
import { useUserStore } from "@/context/userStore";


export async function AttemptCreateInquiry({ inquiry, email }: { inquiry: IInquiry, email: string }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!urlToUse || urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: 'Failed Creation, No URL' };
    }

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
            console.log('Inquiry creation rejected');
            return { status: false, message: 'Failed Creation, Invalid Response' };
        });

        if (!data || data.status !== 200) {
            return { status: false, message: `Failed Creation, ${data?.message || 'Unknown Error'}` };
        }

        const currInquirys = useUserStore.getState().inquiries || [];
        useUserStore.getState().setInquiries([inquiry, ...currInquirys]);

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}
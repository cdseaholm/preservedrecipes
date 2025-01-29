import { SuggestionFormType } from "@/components/forms/suggestionForm";
import { useUserStore } from "@/context/userStore";
import { ISuggestion } from "@/models/types/suggestion";


export async function AttemptCreateSuggestion({ suggestion }: { suggestion: SuggestionFormType }) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    try {
        const res = await fetch(`${urlToUse}/api/suggestion/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ suggestionPassed: suggestion })
        });

        if (!res.ok) {
            return { status: false, message: `Failed Creation, ${res.statusText}` };
        }

        const data = await res.json().catch(() => {
            console.log('Suggestion creation rejected')
        });

        if (!data) {
            return { status: false, message: `Failed Creation, Invalid JSON response` };
        }

        useUserStore.getState().setSuggestions(data.suggestionsReturned as ISuggestion[]);

        return { status: true, message: `Created` };

    } catch (error: any) {
        return { status: false, message: `Failed creation` };
    }
}
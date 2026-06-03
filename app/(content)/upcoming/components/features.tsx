'use client'

import { InfoPageShell, infoPaperClass } from "@/components/layout/page-shells";
import { useModalStore } from "@/context/modalStore"

export default function FeaturesPage() {

    const setOpenInquiryModal = useModalStore(s => s.setOpenInquiryModal);
    const upcoming = [
        { suggestion: 'Communities', description: 'Creatable, and editable communities to share recipes, improvements, or anything cooking related.' },
        { suggestion: 'Account History', description: 'There is already the ability to see recipes made by yourself and family members. With the introduction of communities though, comes the option to see previous posts, comments, or any other sort of interaction taken on the site.' },
        { suggestion: 'Customization', description: 'Beyond the base of what this site is meant to be, there will be minor updates to the profile customization and settings. This could change.' },
        { suggestion: 'Anything else!', description: `Feel free to send in other suggestions to improve the site or to notify me of any bugs you have found! Just click the 'Submit a suggestion here' above.` }
    ] as { suggestion: string, description: string }[];

    const upcomingItems = upcoming.map((up, index) => {
        return (
            <li key={index} className="w-full h-content p-2">
                <h3 className="text-base md:text-lg font-medium text-gray-800">{up.suggestion}</h3>
                <p className="pl-5">{`-${up.description}`}</p>
            </li>
        )
    });

    return (
        <InfoPageShell
            title="Upcoming Features"
            description="A running look at what may come next for Preserved Recipes."
            actions={(
                <button type="button" className="text-blue-700 hover:text-blue-300 hover:underline cursor-pointer" onClick={() => setOpenInquiryModal(true)} aria-label="Submit Suggestions">
                    Submit a suggestion
                </button>
            )}
        >
            <ul className={`${infoPaperClass} flex flex-col items-center justify-center divide-y divide-accent/50`}>
                {upcomingItems}
            </ul>
        </InfoPageShell>
    )
}

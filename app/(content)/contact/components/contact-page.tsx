'use client'

import { InfoPageShell, infoCenteredTextClass, infoPaperClass } from "@/components/layout/page-shells";
import { useModalStore } from "@/context/modalStore";


export default function ContactPage() {
    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);

    return (
        <InfoPageShell
            title="Contact the Preserved Recipes Team"
            description="Questions, feedback, bugs, and product ideas all belong here."
        >
            <p className={infoPaperClass}>
                <span className={infoCenteredTextClass}>
                <span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                    C
                </span>
                urrently we are a small team working hard to bring you the best experience possible with Preserved Recipes. If you wish to contact us, have suggestions, want to report a bug, or just want to say thanks, you can click the Contact button below and fill out the form that should appear!
                </span>
            </p>
            <div className="flex flex-col justify-start items-center sm:flex-row sm:justify-evenly w-full max-w-3xl mt-6 max-sm:space-y-4 sm:space-y-0">

                <button type="button" onClick={() => setOpenInquiryModal(true)} className="bg-accent hover:bg-[#d94f33] text-white font-semibold px-6 py-3 rounded-md shadow-md transition-colors duration-300 w-full sm:w-1/3 text-base md:text-lg cursor-pointer" aria-label="Open Inquiry Modal">
                    Contact the Team
                </button>
            </div>
        </InfoPageShell>
    )
}

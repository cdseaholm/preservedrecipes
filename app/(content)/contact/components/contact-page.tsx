'use client'

import { useModalStore } from "@/context/modalStore";


export default function ContactPage() {
    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);

    const aboutTextClass = "max-w-5xl mx-auto bg-altBack/80 backdrop-blur-md rounded-2xl shadow-2xl text-lg md:text-xl lg:text-2xl leading-relaxed px-6 py-10 md:px-12 md:py-14 m-4 text-center font-light relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#F8E6D3]/30 before:via-transparent before:to-[#E85D3A]/5 before:opacity-60 before:pointer-events-none";

    return (
        <>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-accent mb-8">
                Contact the Preserved Recipes Team
            </h2>
            <p className={aboutTextClass}>
                <span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                    C
                </span>
                urrently we are a small team working hard to bring you the best experience possible with Preserved Recipes. If you wish to contact us, have suggestions, want to report a bug, or just want to say thanks, you can click the Contact button below and fill out the form that should appear!
            </p>
            <div className="flex flex-col justify-start items-center sm:flex-row sm:justify-evenly w-full max-w-3xl mt-6 max-sm:space-y-4 sm:space-y-0">

                <button type="button" onClick={() => setOpenInquiryModal(true)} className="bg-accent hover:bg-[#d94f33] text-white font-semibold px-6 py-3 rounded-md shadow-md transition-colors duration-300 w-full sm:w-1/3 text-base md:text-lg cursor-pointer" aria-label="Open Inquiry Modal">
                    Contact the Team
                </button>
            </div>
        </>
    )
}
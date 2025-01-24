'use client'

import { useModalStore } from "@/context/modalStore"

export default function FeaturesPage() {

    const setOpenSuggestionModal = useModalStore(s => s.setOpenSuggestionModal);

    return (
        <section className="flex flex-col justify-center items-center bg-mainBack" style={{ minHeight: '100vh', width: '100vw' }}>
            <div className="flex flex-row items-center justify-center w-11/12 xl:h-2/3 h-full sm:h-4/5 xl:px-12 max-sm:m-4 xl:py-32 xl:m-5 m-2 p-12 bg-altBack/80 relative overflow-hidden rounded-md">
                <div className="flex flex-col justify-center items-center text-center space-y-5 text-base md:text-xl text-darkText">
                    <li>Communities. Creatable, and editable communities to share recipes, improvements, or anything cooking related.</li>
                    <p>
                        Have an idea you would like to suggest <span>
                            <button className="text-blue-700 hover:text-blue-300 hover:underline" onClick={() => setOpenSuggestionModal(true)}>Submit a suggestion here</button>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    )
}
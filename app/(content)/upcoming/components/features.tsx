'use client'

import { useModalStore } from "@/context/modalStore"

export default function FeaturesPage() {

    const setOpenSuggestionModal = useModalStore(s => s.setOpenSuggestionModal);
    const upcoming = [
        { suggestion: 'Communities', description: 'Creatable, and editable communities to share recipes, improvements, or anything cooking related.' },
        { suggestion: 'Account History', description: 'There is already the ability to see recipes made by yourself and family members. With the introduction of communities though, comes the option to see previous posts, comments, or any other sort of interaction taken on the site.'},
        { suggestion: 'Customization', description: 'Beyond the base of what this site is meant to be, there will be minor updates to the profile customization and settings. This could change.'},
        {suggestion: 'Anything else!', description: `Feel free to send in other suggestions to improve the site or to notify me of any bugs you have found! Just click the 'submit a suggestion here above'`}
    ] as { suggestion: string, description: string }[]

    return (
        <section className="flex flex-col justify-start items-center border-16 border-altBack/80 box-sizing m-2 w-[95.5vw] sm:w-[97vw] md:w-[97.5vw] lg:w-[98vw] xl:w-[98.5vw] min-h-[80vh]">
            <p className="flex flex-row justify-center items-center bg-altBack/80 w-full h-content p-4 pb-8 text-base lg:text-lg">
                Have an idea you would like to suggest? - <span>
                    <button className="text-blue-700 hover:text-blue-300 hover:underline ml-2 cursor-pointer" onClick={() => setOpenSuggestionModal(true)} aria-label="Submit Suggestions">Submit a suggestion here</button>
                </span>
            </p>
            <h2 className="text-xl md:text-2xl underline text-semibold pt-4">Current upcoming updates:</h2>
            <ul className="flex flex-col items-center justify-center w-11/12 xl:h-2/3 h-full sm:h-4/5 xl:px-12 max-sm:m-4 xl:py-32 xl:m-5 m-2 p-8 bg-mainContent relative overflow-hidden rounded-md divide-y divide-accent/50">
                {upcoming.map((up, index) => {
                    return (
                        <li key={index} className="w-full h-content p-2">
                            <h3 className="text-md md:text-lg font-medium text-gray-800">{up.suggestion}</h3>
                            <p className="pl-5">{`-${up.description}`}</p>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
import { useModalStore } from "@/context/modalStore";
import Link from "next/link";

export default function AboutSection({ id }: { id: string }) {

    const setOpenSuggestionModal = useModalStore(state => state.setOpenSuggestionModal);

    return (
        <div className="flex flex-row items-center justify-center w-11/12 xl:h-2/3 h-full sm:h-4/5 xl:px-12 max-sm:m-4 xl:py-32 xl:m-5 m-2 p-12 bg-altBack/80
        relative 
        overflow-hidden rounded-md" id={id}>
            <div className="flex flex-col justify-center items-center text-center space-y-5 text-base md:text-xl text-darkText">
                <p>
                    Preserved Recipes is born from the idea that no family secrets should be left behind. This is much more than simply a recipe web application, but a place for families, individuals, and eventually communities, to come together and share their recipes. That does not mean you cannot keep your recipes secret. Preserved recipes has many ways of picking and choosing who gets to see the recipe. Even if it is everyone, or no one.
                </p>
                <p>
                    Keep your eyes out for future updates too, as we have many exciting ideas coming for Preserved Recipes. Check out our <span>
                        <Link className="text-blue-700 hover:text-blue-300 hover:underline" href={'/upcoming'}>Upcoming Features</Link>
                    </span>, and feel free to send in ideas of your own here <span><button className="text-blue-700 hover:text-blue-300 hover:underline" onClick={() => setOpenSuggestionModal(true)}>here</button></span>!
                </p>
            </div>
        </div>
    )
}
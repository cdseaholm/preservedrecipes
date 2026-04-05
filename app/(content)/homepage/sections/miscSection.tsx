import InTextButton from "@/components/buttons/basicInTextButton";
import { useModalStore } from "@/context/modalStore";
import Link from "next/link";

export default function AboutSection({ id }: { id: string }) {

    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);

    return (
        <div className="flex flex-row items-center justify-center w-11/12 xl:h-2/3 h-full sm:h-4/5 xl:px-12 max-sm:m-4 xl:py-32 xl:m-5 m-2 p-12 bg-mainBack relative overflow-hidden rounded-md" id={id}>
            <div className="flex flex-col justify-center items-center text-center space-y-5 text-base md:text-xl text-black">
                <p>
                    {`Preserved Recipes is born from the idea that no family secrets should be left behind. This is much more than simply a recipe web application, but a place for families, individuals, and eventually communities, to come together and share their recipes. That does not mean you cannot keep your recipes secret. Preserved recipes has many ways of picking and choosing who gets to see the recipe. Even if it is everyone, or no one.`}
                </p>
                <p>
                   {`Keep your eyes out for future updates too, as we have many exciting ideas coming for Preserved Recipes. Check out our ${<span>
                        <Link className="text-accent hover:text-[#d94f33] underline" href={'/communities'}>Communities</Link>
                    </span>}, ${<span>
                        <Link className="text-accent hover:text-[#d94f33] underline" href={'/upcoming'}>Upcoming features</Link>
                    </span>}, or if you want to submit ideas of your own, ${<span><InTextButton buttonText="Click here" ariaLabel="Add Suggestions here" action={() => setOpenInquiryModal(true)} /></span>} to fill out the contact form and select "Suggestion" from the drop down! Thanks for taking interest in Preserved Recipes!`}
                </p>
            </div>
        </div>
    )
}
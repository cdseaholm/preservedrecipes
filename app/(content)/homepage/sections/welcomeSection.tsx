'use client'

import { toast } from "sonner";

export default function WelcomeSection() {


    return (
        <div className="flex flex-col items-start justify-evenly px-8 bg-mainBack/90 h-content w-full pt-12 pb-36 sm:pt-20 md:pt-10 md:pb-40 lg:pt-24 lg:pb-44 space-y-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                Preserve Your Family Recipes
            </h2>
            <h3 className="text-lg md:text-xl md:w-2/3 sm:w-4/5 w-[90%] pb-8 md:pb-16 font-medium">
                {`Create a digital family cookbook to keep your family's recipes alive for generations to come or store your favorite recipes, links, photos of recipes for yourself to use in the future.`}
            </h3>
            <button className="flex flex-col justify-center items-center w-auto h-auto rounded-full hover:bg-mainText hover:scale-105 transition-all duration-300 shadow-md tracking-wide hover:shadow-lg bg-highlight border border-accent py-4 px-6 ml-8" onClick={() => toast.info(`You would sign up right now`)} aria-label="Join">
                <p className="text-lg sm:text-xl lg:text-2xl text-white font-medium">Join for free</p>
            </button>
        </div>
    );
}
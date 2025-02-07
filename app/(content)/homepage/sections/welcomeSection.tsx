'use client'

import { useStateStore } from "@/context/stateStore";
import Image from "next/image";
import { toast } from "sonner";
import recipeBookBackground from '@/public/images/istockphoto-recipebook.jpg';

export default function WelcomeSection() {

    const width = useStateStore(state => state.widthQuery);
    const height = width * (2 / 3);

    return (
        <div className="relative h-full w-full flex flex-col justify-start items-start">
            <Image
                src={recipeBookBackground}
                alt={'Recipe book background'}
                quality={100}
                priority
                className="z-0 h-auto"
                style={{
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
                width={width}
                height={height}
                placeholder="blur"
            />
            <div className="absolute top-0 left-0 flex flex-col items-start justify-evenly px-5 bg-mainBack/90 h-full w-full pt-12 pb-36 sm:pt-20 md:pt-10 md:pb-40 lg:pt-24 lg:pb-44 z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText" style={{ minHeight: '100' }}>
                    Preserve Your Family Recipes
                </h2>
                <h3 className="text-lg md:text-xl md:w-2/3 sm:w-4/5 w-[90%] pb-8 md:pb-16">
                    {`Create a digital family cookbook to keep your family's recipes alive for generations to come or store your favorite recipes, links, photos of recipes for yourself to use in the future.`}
                </h3>
                <button className="flex flex-col justify-center items-center w-auto h-auto rounded-full hover:bg-mainText hover:scale-105 transition-all duration-300 shadow-md text-lightText font-medium tracking-wide hover:shadow-lg bg-highlight border border-accent text-xl lg:text-2xl py-4 px-6 ml-8" onClick={() => toast.info(`You would sign up right now`)} aria-label="Join">
                    Join for free
                </button>
            </div>
        </div>
    );
}
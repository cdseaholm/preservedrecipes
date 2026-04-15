'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IUser } from "@/models/types/personal/user";
import AboutSection from "@/app/(content)/homepage/sections/aboutSection";

export default function AboutPage({ userInfo }: { userInfo: IUser | null }) {

    const aboutTextClass = "max-w-5xl mx-auto bg-altBack/80 backdrop-blur-md rounded-2xl shadow-2xl text-lg md:text-xl lg:text-2xl leading-relaxed px-6 py-10 md:px-12 md:py-14 m-4 text-center font-light relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#F8E6D3]/30 before:via-transparent before:to-[#E85D3A]/5 before:opacity-60 before:pointer-events-none";

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <AboutSection aboutTextClass={aboutTextClass} />
            </ContentWrapper>
        </NavWrapper>
    )
}

{/* <p className={aboutTextClass}>
                    {`${<span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                        P
                    </span>}
                    reserved Recipes started with a simple belief: no family recipe should disappear.
                    Grandma's handwriting on that faded index card, Dad's secret barbecue sauce, your aunt's
                    holiday cookies — those aren't just instructions. They're pieces of who we are.`}
                </p>

                <p className={aboutTextClass}>
                    {`${<span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                        T
                    </span>}
                    his is a home for all of it. A place to safely store your recipes forever,
                    share them with the people you choose (or keep them just for you),
                    discover dishes from other families, and even ask for help when you're tweaking
                    something that's almost perfect. Whether you're building a personal archive,
                    passing traditions to the next generation, or quietly collecting inspiration —
                    it's your call, always.`}
                </p>

                <p className={aboutTextClass}>
                    {`${<span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                        A
                    </span>}
                    t its heart, Preserved Recipes is about connection through food.
                    The kind that happens across kitchen tables, across miles, across years.
                    We're here to help those connections last.`}
                </p> */}
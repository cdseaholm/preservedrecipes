'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";


export default function PricingPage() {

    const aboutTextClass = "max-w-5xl mx-auto bg-altBack/80 backdrop-blur-md rounded-2xl shadow-2xl text-lg md:text-xl lg:text-2xl leading-relaxed px-6 py-10 md:px-12 md:py-14 m-4 text-center font-light relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#F8E6D3]/30 before:via-transparent before:to-[#E85D3A]/5 before:opacity-60 before:pointer-events-none";

    return (
        <ContentWrapper containedChild={true} paddingNeeded={true}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-accent mb-8">
                Pricing Information
            </h2>
            <p className={aboutTextClass}>
                <span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                    T
                </span>
                he great thing about Preserved Recipes right now is that it is free to sign up and use. We want to make sure that everyone has access to preserving their family recipes and traditions. As well as our founders never want pricing to be a barrier to anyone wanting to use the platform.
                That being said, we do have plans to introduce premium features in the future to help support the ongoing development and maintenance of Preserved Recipes. As well as thinking about making certain community features a part of the premium features. However for now, these are free, and we will attempt to honor any existing users with special pricing or discounts. These premium features will most likely be something of a cheap subscription model to unlock certain features. We will make sure to communicate any changes well in advance so that our users can make informed decisions.
            </p>
        </ContentWrapper>
    )
}
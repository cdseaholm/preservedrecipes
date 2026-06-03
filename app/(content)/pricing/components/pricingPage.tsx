'use client'

import { InfoPageShell, infoCenteredTextClass, infoPaperClass } from "@/components/layout/page-shells";


export default function PricingPage() {

    return (
        <InfoPageShell
            title="Pricing Information"
            description="Preserved Recipes is free while we keep building the recipe-preservation experience."
        >
            <p className={infoPaperClass}>
                <span className={infoCenteredTextClass}>
                <span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                    T
                </span>
                he great thing about Preserved Recipes right now is that it is free to sign up and use. We want to make sure that everyone has access to preserving their family recipes and traditions. As well as our founders never want pricing to be a barrier to anyone wanting to use the platform.
                That being said, we do have plans to introduce premium features in the future to help support the ongoing development and maintenance of Preserved Recipes. As well as thinking about making certain community features a part of the premium features. However for now, these are free, and we will attempt to honor any existing users with special pricing or discounts. These premium features will most likely be something of a cheap subscription model to unlock certain features. We will make sure to communicate any changes well in advance so that our users can make informed decisions.
                </span>
            </p>
        </InfoPageShell>
    )
}

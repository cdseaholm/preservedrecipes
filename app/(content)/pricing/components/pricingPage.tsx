'use client'

import { InfoPageShell, infoCenteredTextClass, infoPaperClass } from "@/components/layout/page-shells";


export default function PricingPage() {

    return (
        <InfoPageShell
            title="Pricing Information"
            description="RecipeSafe is free during early access while the MVP is being finished."
        >
            <p className={infoPaperClass}>
                <span className={infoCenteredTextClass}>
                <span className="text-2xl md:text-3xl text-accent font-serif font-bold leading-none">
                    T
                </span>
                he app is free to sign up for and use while RecipeSafe is in early access. The goal right now is simple: make the core recipe-preservation experience useful, dependable, and shaped by real feedback.
                Future paid plans may be introduced to support hosting, storage, and continued development, but pricing will be communicated clearly before anything changes. Early users are helping build the foundation, and that matters.
                </span>
            </p>
        </InfoPageShell>
    )
}

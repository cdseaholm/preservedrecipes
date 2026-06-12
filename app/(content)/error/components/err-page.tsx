'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import { useRouter } from "next/navigation"

export default function ErrorPage() {

    const router = useRouter();

    return (
        <ContentWrapper containedChild={false} paddingNeeded={true}>
            <div className="flex min-h-[60dvh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-2xl font-semibold text-mainText md:text-3xl">Something went wrong</h1>
                <p className="text-sm text-mainText/70 md:text-base">
                    We could not load that part of Preserved Recipes. You can head back home and try again.
                </p>
                <button
                    type="button"
                    className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d94f33]"
                    onClick={() => router.push('/')}
                >
                    Back to home
                </button>
            </div>
        </ContentWrapper>
    )
}

'use client'

import MainHeader from "./header";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AppHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const headerClass = `bg-mainBack w-full flex flex-row items-center px-5 border-b border-accent fixed text-mainText px-5 py-2 md:px-12 md:py-2 min-h-[75px]`;

    if (pathname === '/color-picker-mode') {
        return (
            <header className={`${headerClass} justify-end`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        Exit Color Picker Mode
                    </Link>
                </section>
            </header>
        )
    }

    return (
        <Suspense fallback={
            <header className={`${headerClass} justify-start`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        PreservedRecipes
                    </Link>
                </section>
            </header>
        }>
            <header className={`${headerClass} justify-between`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        {'Preserved Recipes'}
                    </Link>
                </section>
                <MainHeader session={session} />
            </header>
        </Suspense>
    )
}
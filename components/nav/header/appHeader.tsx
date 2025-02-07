import { getServerSession } from "next-auth"
import MainHeader from "./header";
import Link from "next/link";
import { Suspense } from "react";

export default async function AppHeader() {

    const headerClass = `bg-mainBack w-full flex flex-row justify-between items-center px-5 border-b border-accent fixed text-mainText px-5 py-2 md:px-12 md:py-2 min-h-[75px]`;

    const session = await getServerSession();

    return (
        <Suspense fallback={
            <header className={headerClass}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        PreservedRecipes
                    </Link>
                </section>
            </header>
        }>
            <header className={headerClass}>
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
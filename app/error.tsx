'use client'

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <main className="flex min-h-dvh w-full items-center justify-center bg-mainBack px-4 text-mainText">
                    <div className="flex w-full max-w-xl flex-col items-center gap-4 text-center">
                        <h1 className="text-2xl font-semibold md:text-3xl">Something went wrong</h1>
                        <p className="text-sm text-mainText/70 md:text-base">
                            Preserved Recipes hit an unexpected error. Try again, or return home if it keeps happening.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d94f33]"
                                onClick={reset}
                            >
                                Try again
                            </button>
                            <Link
                                href="/"
                                className="rounded-md border border-accent/40 px-5 py-2 text-sm font-semibold text-mainText transition hover:bg-accent/10"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}

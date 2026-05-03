'use client'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function AuthWrapper({ children, session }: { children: React.ReactNode, session?: Session | null }) {
    const sessionProviderProps = session === undefined ? {} : { session };

    return (
        <SessionProvider {...sessionProviderProps} refetchOnWindowFocus={true}>
            {children}
        </SessionProvider>
    );
}

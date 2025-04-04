'use client'

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { LoadingSpinner } from "../misc/loadingSpinner";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthContent>{children}</AuthContent>
        </SessionProvider>
    );
}

function AuthContent({ children }: { children: ReactNode }) {
    const { data: _session, status } = useSession();

    if (status === "loading") {
        return <LoadingSpinner screen={true} />;
    }

    return <>{children}</>;
}
'use client'

import { Session } from "next-auth";

export default function FamilyPage({session}: {session: Session | null}) {
    return (
        <section className="flex flex-col justify-center items-center bg-mainBack" style={{ minHeight: '100vh', width: '100vw' }}>
            {`Family Page ${session ? session : null}`}
        </section>
    )
}
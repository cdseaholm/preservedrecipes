'use client'

import AboutSection from "@/app/(content)/homepage/sections/aboutSection";
import { InfoPageShell } from "@/components/layout/page-shells";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IUser } from "@/models/types/personal/user";

export default function AboutPage({ userInfo }: { userInfo: IUser | null }) {
    return (
        <NavWrapper userInfo={userInfo}>
            <InfoPageShell
                title="About RecipeSafe"
                description="A home for the recipes, food stories, and family traditions worth keeping."
            >
                <AboutSection />
            </InfoPageShell>
        </NavWrapper>
    )
}

'use client'

import { toast } from "sonner";
import Link from "next/link";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import SubMenuButton, { buttonClass, textClass } from "@/components/buttons/sub-menu-button";

export default function CommunitiesSubMenu({ closeDrawer }: { closeDrawer: () => void }) {

    const isUser = true; // Replace with actual logic to determine if the user is logged in
    const { handleSignInClick } = MenuPanelHooks();

    const toRender = !isUser ? (
        <>
            <p className={textClass}>Join Preserved Recipes to create and join communities!</p>
            <Link href={"/register"} className={buttonClass} onClick={closeDrawer}><p className={textClass}>Register</p></Link>
            <SubMenuButton title="Sign In" onClick={() => { handleSignInClick(); closeDrawer(); }} />
        </>
    ) : (
        <>
            <SubMenuButton title="Create Community" onClick={() => { toast.info('Create community feature coming soon!'); closeDrawer(); }} />
            <SubMenuButton title="View My Communities" onClick={() => { toast.info('View all communities!'); closeDrawer(); }} />
            <SubMenuButton title="View Saved Communities" onClick={() => { toast.info('Saved feature coming soon!'); closeDrawer(); }} />
        </>
    )

    return toRender;
}
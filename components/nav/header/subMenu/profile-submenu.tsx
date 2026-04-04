'use client'

import Link from "next/link";

export default function ProfileSubMenu({ closeDrawer }: { closeDrawer: () => void }) {

    const buttonClass = `flex flex-row items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer py-4 mb-2`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium`;
    const disabledTextClass = `flex flex-row justify-start items-center text-start text-base md:text-lg lg:text-xl font-medium text-gray-500 w-full px-6 py-4 mb-2 rounded-md`;

    return (
        <>
            <Link href="/profile/history" className={buttonClass} onClick={closeDrawer}><p className={textClass}>Account History</p></Link>
            <Link href="/profile/suggestions" className={buttonClass} onClick={closeDrawer}><p className={textClass}>Suggestions</p></Link>
            <Link href="/profile/settings" className={buttonClass} onClick={closeDrawer}><p className={textClass}>Settings</p></Link>
            <Link href="/profile/recipes" className={buttonClass} onClick={closeDrawer}><p className={textClass}>Recipes</p></Link>
            {/**<Link href="/communities/user" className={buttonClass} onClick={closeDrawer}><p className={textClass}>Communities</p></Link> */}
            <p className={disabledTextClass} title="Under Construction">Communities</p>
            
        </>
    )
}
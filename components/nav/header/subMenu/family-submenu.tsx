'use client'

import SubMenuButton from "@/components/buttons/sub-menu-button";
import SubMenuLink from "@/components/buttons/sub-menu-link";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";

export default function FamilySubMenu({ closeDrawer }: { closeDrawer: () => void }) {

    const { handleSetOpenCreateFamilyModal, userFamilyID } = MenuPanelHooks();

    const toRender = !userFamilyID || userFamilyID === '' ? (
        <SubMenuButton title="Create Family" onClick={() => { handleSetOpenCreateFamilyModal(); closeDrawer(); }} />
    ) : (
        <>
            <SubMenuLink title="DashBoard" hrefString={`/family/${userFamilyID}`} onClick={closeDrawer} />
            <SubMenuLink title="Recipes" hrefString={`/family/${userFamilyID}/recipes`} onClick={closeDrawer} />
            <SubMenuLink title="Members" hrefString={`/family/${userFamilyID}/members`} onClick={closeDrawer} />
            <SubMenuLink title="Settings" hrefString={`/family/${userFamilyID}/settings`} onClick={closeDrawer} />
        </>
    );

    return toRender;
}
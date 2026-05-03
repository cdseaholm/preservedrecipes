import NavWrapper from "@/components/wrappers/navWrapper";
import ColorPickerMode from "./components/colorPickerMode";
import { getSessionUser } from "@/lib/data/user";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Color Picker Mode",
    description: "Customize the Preserved Recipes color experience with a focused color picker mode for testing interface palettes.",
});

export default async function Page() {
    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <ColorPickerMode />
        </NavWrapper>
    )
}

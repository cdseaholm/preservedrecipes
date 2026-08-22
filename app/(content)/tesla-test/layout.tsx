import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Project Echelon Test",
    description: "Interact with a RecipeSafe UI experiment for an electric concept vehicle control surface.",
    robots: { index: false, follow: false },
});

export default function TeslaTestLayout({ children }: { children: React.ReactNode }) {
    return children;
}

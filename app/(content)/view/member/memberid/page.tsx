import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Member",
    description: "View a RecipeSafe member profile when a valid member link is provided.",
    robots: { index: false, follow: false },
});

export default function Page() {
    notFound();
}

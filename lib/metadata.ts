import type { Metadata } from "next";

const siteName = "RecipeSafe";
const defaultDescription =
    "Keep family recipes safe with a private-first recipe archive for saved dishes, cooking notes, and food memories.";

type PageMetadataOptions = {
    title: string;
    description: string;
    robots?: Metadata["robots"];
};

export function createPageMetadata({
    title,
    description,
    robots,
}: PageMetadataOptions): Metadata {
    return {
        title,
        description,
        applicationName: siteName,
        openGraph: {
            title,
            description,
            siteName,
            type: "website",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        robots,
    };
}

export const defaultSiteMetadata: Metadata = {
    title: {
        default: siteName,
        template: `%s - ${siteName}`,
    },
    description: defaultDescription,
    applicationName: siteName,
    keywords: [
        "recipesafe",
        "family recipes",
        "recipe organizer",
        "recipe archive",
        "cooking traditions",
        "preserved recipes",
    ],
    creator: siteName,
    publisher: siteName,
    icons: {
        icon: "/images/favicon.png",
    },
    openGraph: {
        title: siteName,
        description: defaultDescription,
        siteName,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: siteName,
        description: defaultDescription,
    },
};

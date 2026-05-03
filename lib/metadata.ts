import type { Metadata } from "next";

const siteName = "Preserved Recipes";
const defaultDescription =
    "Preserve, organize, and share family recipes, community cooking traditions, and personal recipe collections.";

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
        "preserved recipes",
        "family recipes",
        "recipe organizer",
        "community recipes",
        "cooking traditions",
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

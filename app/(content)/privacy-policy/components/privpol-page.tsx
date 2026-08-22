'use client'

import { InfoPageShell, infoPaperClass } from "@/components/layout/page-shells";

const contactLines = ['Seaholm LLC, doing business as RecipeSafe', 'Denver, CO, United States', 'newprogresscs@gmail.com'];

const sections = [
    {
        title: "Introduction",
        body: "RecipeSafe is operated by Seaholm LLC, a Colorado limited liability company doing business as RecipeSafe. RecipeSafe (\"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy explains how we collect, use, store, and share information when you use RecipeSafe, including getrecipesafe.com and related recipe-management features."
    },
    {
        title: "Information We Collect",
        body: "We may collect account information, profile details, email addresses, authentication data, recipes, ingredients, notes, images, family or community information, invite information, contact requests, support messages, device/browser information, logs, and usage information needed to operate and improve RecipeSafe."
    },
    {
        title: "Recipe and User Content",
        body: "Recipes, notes, images, posts, and family information you add to RecipeSafe may contain personal or sensitive information that you choose to include. Please avoid adding information you do not want stored or shared with the people you invite or authorize."
    },
    {
        title: "How We Use Information",
        body: "We use information to create and manage accounts, provide recipe-saving features, authenticate users, send invites and service emails, respond to support requests, improve RecipeSafe, prevent abuse, protect security, troubleshoot issues, and comply with legal obligations."
    },
    {
        title: "Sharing and Disclosure",
        body: "We do not sell your personal information. We may share information with service providers that help us run RecipeSafe, with people you choose to share content with, when required by law, to protect rights and safety, or in connection with a business transfer such as a merger, acquisition, or asset sale."
    },
    {
        title: "Third-Party Service Providers",
        body: "RecipeSafe may use third-party providers for hosting, databases, authentication, email delivery, file uploads, analytics, error monitoring, and similar operational needs. These providers may process information on our behalf according to their own terms and privacy practices."
    },
    {
        title: "Cookies and Similar Technologies",
        body: "RecipeSafe may use cookies, local storage, and similar technologies for authentication, preferences, security, analytics, and site functionality. You can adjust browser settings to limit cookies, but some features may not work correctly."
    },
    {
        title: "Data Security",
        body: "We use reasonable administrative, technical, and organizational measures to protect information. No online service is perfectly secure, and we cannot guarantee that information will never be accessed, disclosed, altered, or lost."
    },
    {
        title: "Data Retention",
        body: "We keep information for as long as needed to provide RecipeSafe, comply with legal obligations, resolve disputes, enforce agreements, maintain backups, and protect the service. Some deleted information may remain in backups or logs for a limited time."
    },
    {
        title: "Your Choices",
        body: "You may update certain account information in RecipeSafe. You may request help accessing, correcting, or deleting information by contacting us. We may need to verify your identity before completing some requests."
    },
    {
        title: "Children's Privacy",
        body: "RecipeSafe is not intended for children under 13 without parent or guardian involvement. If you believe a child has provided personal information without appropriate permission, contact us so we can review and take appropriate action."
    },
    {
        title: "Food, Allergy, and Health Information",
        body: "RecipeSafe is not designed to verify allergens, nutrition, health claims, cooking temperatures, or food safety. Any dietary or health-related information users add is user-provided and should be independently verified before use."
    },
    {
        title: "External Links",
        body: "RecipeSafe may link to third-party websites or services. We are not responsible for the privacy practices, content, or security of those third parties."
    },
    {
        title: "Brand Non-Affiliation",
        body: "RecipeSafe is not affiliated with, endorsed by, or sponsored by RecipeSage. RecipeSage is a separate recipe-management product."
    },
    {
        title: "Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. Updates are effective when posted unless a later date is stated. Continued use of RecipeSafe after changes are posted means you acknowledge the updated policy."
    },
    {
        title: "Contact Information",
        body: "Questions about this Privacy Policy can be sent to:"
    },
];

export default function PrivacyPolicyPage() {
    return (
        <InfoPageShell
            title="Privacy Policy"
            description="Effective Date: August 22, 2026"
        >
            <div className={`${infoPaperClass} flex flex-col justify-start items-start space-y-6`}>
                {sections.map((section, index) => (
                    <section className="flex w-full flex-col items-start justify-start space-y-2" key={section.title}>
                        <h4 className="pb-2 text-base font-semibold text-accent underline md:text-base">
                            {index + 1}. {section.title}
                        </h4>
                        <p className="text-left">{section.body}</p>
                        {section.title === "Contact Information" && (
                            <ul className="grid w-full grid-cols-1 items-center gap-1 text-start text-sm md:text-base">
                                {contactLines.map(item => (
                                    <li className="mx-3 my-1 flex-wrap text-center text-sm font-normal md:text-base" key={item}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </InfoPageShell>
    );
};

'use client'

import { InfoPageShell, infoPaperClass } from "@/components/layout/page-shells";

const contactLines = ['Seaholm LLC, doing business as RecipeSafe', 'Denver, CO, United States', 'support@getrecipesafe.com'];

const sections = [
    {
        title: "Acceptance of Terms",
        body: "RecipeSafe is operated by Seaholm LLC, a Colorado limited liability company, doing business as RecipeSafe. By accessing or using RecipeSafe, including the website at getrecipesafe.com and related recipe-management features, you agree to these Terms of Service. If you do not agree, please do not use RecipeSafe."
    },
    {
        title: "Early Access Service",
        body: "RecipeSafe is an early access product. Features may change, break, be removed, or be unavailable while the service is being built. We may modify, suspend, or discontinue any part of the service at any time."
    },
    {
        title: "Accounts and Security",
        body: "You are responsible for keeping your login credentials secure and for all activity under your account. You agree to provide accurate account information and to notify us if you believe your account has been accessed without permission."
    },
    {
        title: "Your Content",
        body: "You keep ownership of recipes, photos, notes, posts, family information, and other content you submit to RecipeSafe. By submitting content, you grant RecipeSafe a limited license to host, store, process, display, and transmit that content as needed to provide and improve the service."
    },
    {
        title: "Content Responsibility",
        body: "You are responsible for the content you add to RecipeSafe. Do not upload content that you do not have permission to use, content that violates another person's rights, or content that is unlawful, harmful, abusive, or misleading."
    },
    {
        title: "Recipe, Food, and Health Disclaimer",
        body: "RecipeSafe is a recipe-organization service, not a medical, nutrition, allergy, food-safety, or professional advice service. You are responsible for checking ingredients, allergens, food handling, cooking temperatures, dietary needs, and any health-related decisions before preparing or sharing recipes."
    },
    {
        title: "Intellectual Property",
        body: "RecipeSafe, the RecipeSafe name, site design, software, logos, text, and other platform materials are owned by us or our licensors and are protected by intellectual property laws. RecipeSafe is not affiliated with, endorsed by, or sponsored by RecipeSage."
    },
    {
        title: "Acceptable Use",
        body: "You agree not to misuse RecipeSafe, attempt to access systems without authorization, interfere with the service, scrape or copy the service at scale, upload malicious code, or use RecipeSafe to violate the rights of others."
    },
    {
        title: "Third-Party Services",
        body: "RecipeSafe may rely on third-party services for hosting, authentication, email, file uploads, analytics, payments, or other operations. We are not responsible for third-party websites, services, outages, policies, or content."
    },
    {
        title: "No Warranties",
        body: "RecipeSafe is provided as is and as available. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, availability, accuracy, and non-infringement."
    },
    {
        title: "Limitation of Liability",
        body: "To the fullest extent permitted by law, RecipeSafe and its owners, operators, employees, contractors, and affiliates will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of data, recipes, profits, goodwill, or business opportunities arising from your use of the service."
    },
    {
        title: "Termination",
        body: "We may suspend or terminate access to RecipeSafe if we believe you violated these Terms, created risk for the service or other users, or used the service unlawfully. You may stop using RecipeSafe at any time."
    },
    {
        title: "Changes to These Terms",
        body: "We may update these Terms from time to time. Changes are effective when posted unless a later date is stated. Continued use of RecipeSafe after changes are posted means you accept the updated Terms."
    },
    {
        title: "Governing Law",
        body: "These Terms are governed by the laws of the State of Colorado, without regard to conflict-of-law rules."
    },
    {
        title: "Contact Information",
        body: "Questions about these Terms can be sent to:"
    },
];

export default function TosPage() {
    return (
        <InfoPageShell
            title="Terms of Service"
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
    )
};

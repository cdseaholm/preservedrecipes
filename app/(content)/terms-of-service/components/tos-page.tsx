'use client'

import { InfoPageShell, infoPaperClass } from "@/components/layout/page-shells";

export default function TosPage() {

    const sectionTitles = [
        "Acceptance of Terms",
        "Use of Site",
        "Intellectual Property",
        "Disclaimer of Warranties",
        "Limitation of Liability",
        "Links to Third-Party Websites",
        "Modifications to the Site and Terms",
        "Governing Law",
        "Contact Information",
        "Severability",
        "Entire Agreement"
    ];

    const sectionBlurbs = [
        [`By accessing and using the website of Preserved Recipes ("we," "us," or "our") at www.preservedrecipes.com, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Site.`],
        [`This Site is for informational purposes only. You agree to use the Site only for lawful purposes and in accordance with these Terms.`],
        ['The content on this Site, including text, graphics, logos, and images, is the property of Preserved Recipes and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our express written consent.'],
        ['The information provided on this Site is for general informational purposes only and does not constitute professional advice. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the Site.'],
        ['Preserved Recipes shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, the Site.'],
        ['Our Site may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of these sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.'],
        ['We reserve the right to modify or discontinue, temporarily or permanently, the Site (or any part thereof) with or without notice. We may also revise these Terms from time to time. The revised Terms will be effective when posted on the Site.'],
        ['These Terms shall be governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions.'],
        ['If you have questions or comments about these Terms, please contact us at: '],
        ["If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect."],
        [`These Terms constitute the entire agreement between you and Preserved Recipes regarding your use of the Site, superseding any prior agreements between you and Preserved Recipes relating to your use of the Site.`]
    ];

    const sectionBPs = [
        'Preserved Recipes', 'Denver, CO. United States', 'newprogresscs@gmail.com'
    ];

    const termsOfServiceItems = sectionTitles.map((title, index) => (
        <div className={`flex flex-col justify-start items-start w-full space-y-2`} key={`${index}blurbParent`}>
            <h4 className='text-base md:text-base underline pb-2 font-semibold text-accent' key={`${index}Title`}>
                {`${index + 1}. ${title}`}
            </h4>
            {index === 10 ? (
                <div className="flex flex-col justify-start items-start space-y-2 w-full">
                    <p key={`${index}BlurbOne`} className="text-left">
                        {sectionBlurbs[index]}
                    </p>
                    <p key={`${index}BlurbTwo`} className="text-left">
                        {sectionBlurbs[index + 1]}
                    </p>
                </div>
            ) : index === 8 ? (
                <div className="flex flex-col justify-start items-start space-y-2 w-full">
                    <p key={`${index}BlurbOne`} className="text-left">
                        {sectionBlurbs[index]}
                    </p>
                    <ul className={`text-sm md:text-base grid grid-cols-1 grid-rows-${sectionBPs.length} items-center gap-1 text-start w-full`}>
                        {sectionBPs.map((item, index) => (
                            <li className="text-sm md:text-base font-normal flex-wrap mx-3 my-1 text-center" key={`${index}List`}>
                                {`${item}`}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex flex-col justify-start items-start space-y-2 w-full ">
                    <p key={`${index}BlurbOne`} className="text-left">
                        {sectionBlurbs[index]}
                    </p>
                </div>
            )}
        </div>
    ));

    //functions

    return (
        <InfoPageShell
            title="Terms of Service"
            description={`Effective Date: ${new Date().toLocaleDateString()}`}
        >
            <div className={`${infoPaperClass} flex flex-col justify-start items-start space-y-6`}>
                {termsOfServiceItems}
            </div>
        </InfoPageShell>

    )
};

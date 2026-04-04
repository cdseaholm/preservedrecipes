'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";


const ListSection = ({ items }: { items: string[] }) => {
    return (
        items.length !== 5 ? (<ul className={`list-disc text-sm md:text-base grid grid-cols-1 grid-rows-${items.length} items-center gap-1 text-start w-full`}>
            {items.map((item, index) => (
                <li className="list-disc text-sm md:text-base font-normal flex-wrap mx-3 my-1" style={{ listStyleType: 'disc', listStyle: 'inside' }} key={index}>
                    {` ${item}`}
                </li>
            ))}
        </ul>
        ) : (
            <ul className={`text-sm md:text-base grid grid-cols-1 grid-rows-${items.length} items-center gap-1 text-start w-full`}>
                {items.map((item, index) => (
                    <li className="text-sm md:text-base font-normal flex-wrap mx-3 my-1" key={index}>
                        {` ${item}`}
                    </li>
                ))}
            </ul>
        )
    )
};

export default function PrivacyPolicyPage() {

    const sectionTitles = [
        "Introduction",
        "Information We Collect",
        "How We Use Your Information",
        "Information Sharing and Discolsure",
        "Data Security",
        "Cookies and Tracking Technologies",
        "Third Party Links",
        "Children's Privacy",
        "Changes to this Privacy Policy",
        "Contact Information"
    ];

    const sectionBlurbs = [
        [`Preserved Recipes ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at www.preservedrecipes.com (the "Site").`],
        [`We collect information that you voluntarily provide to us when you use our Site, such as when you: `, `The information we collect may include: `],
        [`We use the information we collect to: `],
        ['We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.'],
        ['We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'],
        ['Our Site may use cookies and similar tracking technologies to enhance your browsing experience. You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies.'],
        ['Our Site may contain links to third-party websites. We have no control over the content, privacy policies, or practices of any third-party sites or services.'],
        ['Our Site is not intended for children under 13 years of age unless accompanied by an adult to use the site for the intended purposes and the intended purposes only. Children under the age of 13 may sign up for the site under adult supervision, in which case the adult is advised to use their own name, email, and any other information they do want saved to the site database for future use.'],
        ['We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this policy.'],
        ['If you have questions or comments about this Privacy Policy, please contact us at: ']
    ];

    const sectionBPs = [
        [`Contact us through the provided contact information`, `Subscribe to newsletters or updates (if applicable)`],
        [`Name`, `Email address`, `Phone number`, `Any other information you choose to provide`],
        [`Respond to your inquiries`, `Provide you with information about our services`, `Improve our Site and services`],
        ['Preserved Recipes', 'Denver, CO. United States', 'newprogresscs@gmail.com']
    ];

    const privacyItems = sectionTitles.map((title, index) => {
        let item;
        let itemTwo;
        if (index === 9) {
            item = sectionBPs[3];
        } else if (index === 1) {
            item = sectionBPs[0];
            itemTwo = sectionBPs[1];
        } else {
            item = sectionBPs[2];
        }

        return (
            <div className={`flex flex-col justify-start items-start w-full space-y-2`} key={`${index}parentKey`}>
                <h4 className='text-base md:text-base underline pb-2 font-semibold text-accent'>
                    {`${index + 1}. ${title}`}
                </h4>
                {index === 0 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 ? (
                    <p key={index} className="text-left">
                        {sectionBlurbs[index]}
                    </p>
                ) : index === 1 && item && itemTwo ? (
                    <div className="flex flex-col justify-start items-start space-y-2 w-full">
                        <p key={`${index}blurbOne`} className="text-left">
                            {sectionBlurbs[index]}
                        </p>
                        <ListSection key={`${index}ListOne`} items={item} />
                        <p key={`${index}blurbTwo`} className="text-left">
                            {sectionBlurbs[index]}
                        </p>
                        <ListSection key={`${index}ListTwo`} items={itemTwo} />
                    </div>
                ) : index === 9 && item ? (
                    <div className="flex flex-col justify-start items-start space-y-2 w-full">
                        <p key={`${index}BlurbOne`} className="text-left">
                            {sectionBlurbs[index]}
                        </p>
                        <ul className={`text-sm md:text-base grid grid-cols-1 grid-rows-${sectionBPs.length} items-center gap-1 text-start w-full`}>
                            {item.map((text, index) => (
                                <li className="text-sm md:text-base font-normal flex-wrap mx-3 my-1 text-center" key={`${index}List`}>
                                    {`${text}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col justify-start items-start space-y-2 w-full">
                        <p key={`${index}blurbOne`} className="text-left">
                            {sectionBlurbs[index]}
                        </p>
                        {item &&
                            <ListSection key={`${index}List`} items={item} />
                        }
                    </div>
                )}
            </div>
        )
    });

    return (
        <ContentWrapper containedChild={false} paddingNeeded={true}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-accent mb-8">
                {'Privacy Policy for Preserved Recipes'}
            </h2>
            <h3 className="text-base md:text-lg font-medium text-center text-mainText/80 mb-4">
                {`Effective Date: ${new Date().toLocaleDateString()}`}
            </h3>
            <div className="max-w-5xl mx-auto bg-altBack/80 backdrop-blur-md rounded-2xl shadow-2xl text-lg md:text-xl lg:text-2xl leading-relaxed px-6 py-10 md:px-12 md:py-14 m-4 text-center font-light relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#F8E6D3]/30 before:via-transparent before:to-[#E85D3A]/5 before:opacity-60 before:pointer-events-none flex flex-col justify-start items-start space-y-6">
                {privacyItems}
            </div>
        </ContentWrapper>
    );
};

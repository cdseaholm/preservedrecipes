'use client'

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

export default function Page() {

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
        ['Preserved Recipes', 'Denver, CO', 'United States', 'newprogresscs@gmail.com']
    ];

    //functions

    return (
        <section className="flex flex-col h-content w-full p-2">
            <div className="flex flex-col justify-center items-center w-full homeDiv h-full rounded-md border border-accent/30">
                <div className="flex flex-col justify-start items-center w-full h-full backdrop-blur-sm bg-white/70 shadow-xl rounded-md">
                    <div className="flex flex-col justify-center items-center w-full px-10 rounded-md text-center h-full py-16">
                        <p className="font-semibold text-lg w-full">
                            {'Privacy Policy for Preserved Recipes'}
                        </p>
                        <p>
                            {`Effective Date: ${new Date().toLocaleDateString()}`}
                        </p>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col justify-start items-center py-12 px-1 h-full w-full space-y-5 `}>
                <div className={`flex flex-row justify-center rounded-md items-center py-4 md:py-12 px-1 h-full w-full shadow-2xl mix-blend-darken bg-gradient-to-br from-orange-200 to-blue-50 md:mx-1`}>
                    <div className="flex flex-col justify-start items-start w-full px-4 md:px-10 rounded-md space-y-4">
                        {sectionTitles.map((title, index) => {
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
                                    <h4 className='text-md md:text-base underline pb-2 font-semibold'>
                                        {`${index + 1}. ${title}`}
                                    </h4>
                                    {index === 0 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 ? (
                                        <p key={index}>
                                            {sectionBlurbs[index]}
                                        </p>
                                    ) : index === 1 && item && itemTwo ? (
                                        <div className="flex flex-col justify-start items-start space-y-2 w-full">
                                            <p key={`${index}blurbOne`}>
                                                {sectionBlurbs[index]}
                                            </p>
                                            <ListSection key={`${index}ListOne`} items={item} />
                                            <p key={`${index}blurbTwo`}>
                                                {sectionBlurbs[index]}
                                            </p>
                                            <ListSection key={`${index}ListTwo`} items={itemTwo} />
                                        </div>
                                    ) : index === 9 && item ? (
                                        <div className="flex flex-col justify-start items-start space-y-2 w-full">
                                            <p key={`${index}blurbOne`}>
                                                {sectionBlurbs[index]}
                                            </p>
                                            <ListSection key={`${index}list`} items={item} />
                                            <p key={`${index}blurbTwo`}>
                                                {sectionBlurbs[10]}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-start items-start space-y-2 w-full">
                                            <p key={`${index}blurbOne`}>
                                                {sectionBlurbs[index]}
                                            </p>
                                            {item &&
                                                <ListSection key={`${index}List`} items={item} />
                                            }
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
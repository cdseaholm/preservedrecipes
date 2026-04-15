'use client'

import { FaBook, FaUsers, FaLock, FaSearch, FaImage, FaFileExport } from "react-icons/fa";

export default function FeaturesSection() {
    const features = [
        {
            icon: <FaBook className="text-4xl text-accent" />,
            title: "Digital Cookbook",
            description: "Store unlimited recipes with photos, ingredients, and step-by-step instructions."
        },
        {
            icon: <FaUsers className="text-4xl text-accent" />,
            title: "Family Sharing",
            description: "Create a family tree and share recipes with loved ones across generations."
        },
        {
            icon: <FaLock className="text-4xl text-accent" />,
            title: "Privacy Control",
            description: "Keep recipes private, share with family only, or make them public. You decide."
        },
        {
            icon: <FaSearch className="text-4xl text-accent" />,
            title: "Easy Search",
            description: "Find any recipe instantly with powerful search and filtering tools."
        },
        {
            icon: <FaImage className="text-4xl text-accent" />,
            title: "Photo Uploads",
            description: "Add beautiful photos to your recipes and preserve visual memories."
        },
        {
            icon: <FaFileExport className="text-4xl text-accent" />,
            title: "Export & Print",
            description: "Generate PDFs and print recipe cards for offline cooking."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 space-y-12" id="features-section">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    Everything You Need to Preserve Recipes
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-3xl mx-auto">
                    Powerful features designed to keep your family&apos;s culinary traditions alive
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {features.map((feature, index) => (
                    <div 
                        key={index}
                        className="flex flex-col items-start space-y-4 p-6 bg-mainBack rounded-lg border-2 border-accent/20 hover:border-accent hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-3 bg-altBack rounded-lg">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-mainText">
                            {feature.title}
                        </h3>
                        <p className="text-base text-mainText/70">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
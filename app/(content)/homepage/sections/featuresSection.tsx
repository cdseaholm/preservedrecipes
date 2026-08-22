'use client'

import { FaBook, FaHeart, FaLock, FaSearch, FaTags, FaUserFriends } from "react-icons/fa";

export default function FeaturesSection() {
    const features = [
        {
            icon: <FaBook className="text-4xl text-accent" />,
            title: "Digital Cookbook",
            description: "Save recipes with ingredients, steps, prep details, notes, and the context that usually gets lost."
        },
        {
            icon: <FaHeart className="text-4xl text-accent" />,
            title: "Made for Heirlooms",
            description: "Keep the recipes that matter most in one place instead of scattered across texts, cards, and memory."
        },
        {
            icon: <FaLock className="text-4xl text-accent" />,
            title: "Private First",
            description: "Start with your own collection and choose what belongs beyond your personal cookbook later."
        },
        {
            icon: <FaSearch className="text-4xl text-accent" />,
            title: "Easy Search",
            description: "Find recipes quickly by name, ingredients, tags, and the details you remember."
        },
        {
            icon: <FaTags className="text-4xl text-accent" />,
            title: "Simple Organization",
            description: "Use types, tags, ingredients, and favorites to keep a growing collection manageable."
        },
        {
            icon: <FaUserFriends className="text-4xl text-accent" />,
            title: "Family Tools in Progress",
            description: "Family spaces and sharing are part of the direction, but the first priority is a dependable recipe archive."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 space-y-12" id="features-section">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    A Focused Start for RecipeSafe
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-3xl mx-auto">
                    Family recipes, kept safe. Save the recipe, protect the memory, and make it easy to find again.
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

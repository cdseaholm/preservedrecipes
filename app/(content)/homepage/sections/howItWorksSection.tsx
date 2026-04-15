'use client'

import { FaUserPlus, FaBook, FaUsers } from "react-icons/fa";

export default function HowItWorksSection() {
    const steps = [
        {
            icon: <FaUserPlus className="text-5xl text-accent" />,
            title: "1. Sign Up",
            description: "Create your free account in seconds. No credit card needed."
        },
        {
            icon: <FaBook className="text-5xl text-accent" />,
            title: "2. Add Recipes",
            description: "Start building your digital cookbook with your favorite family recipes."
        },
        {
            icon: <FaUsers className="text-5xl text-accent" />,
            title: "3. Share & Preserve",
            description: "Invite family members and keep your culinary traditions alive forever."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    How It Works
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-2xl mx-auto">
                    Three simple steps to preserve your family&apos;s recipes
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 w-full">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-mainBack/50 transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="p-4 bg-mainBack rounded-full shadow-md">
                            {step.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-mainText">
                            {step.title}
                        </h3>
                        <p className="text-base md:text-lg text-mainText/70">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
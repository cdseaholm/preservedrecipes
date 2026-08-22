'use client'

import { useNavigation } from "@/components/hooks/menu/use-navigation-hook";
import { FaCheck, FaArrowRight } from "react-icons/fa";

export default function PricingTeaserSection() {
    const { navigate } = useNavigation();

    const features = [
        "Create and manage your recipe archive",
        "Add ingredients, steps, tags, and notes",
        "Search and organize saved recipes",
        "Early access to family and sharing improvements",
        "Mobile-friendly recipe pages",
        "No credit card required"
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-block px-4 py-2 bg-accent/10 rounded-full">
                    <span className="text-accent font-bold text-sm uppercase tracking-wide">Early Access</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    Start Preserving for Free
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-2xl mx-auto">
                    RecipeSafe is free while the MVP is being shaped with early users.
                </p>
            </div>

            <div className="w-full bg-mainBack rounded-xl shadow-2xl border-2 border-accent/30 overflow-hidden">
                <div className="bg-gradient-to-r from-accent to-[#d94f33] p-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">Early Access</h3>
                    <p className="text-4xl md:text-5xl font-bold text-white mt-2">$0</p>
                    <p className="text-white/90 mt-1">Free while the core app is being finished</p>
                </div>

                <div className="p-8 space-y-6">
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                    <FaCheck className="text-accent text-sm" aria-hidden="true" />
                                </div>
                                <span className="text-mainText text-lg">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-[#d94f33] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
                        onClick={() => navigate('/register')}
                    >
                        <span className="text-lg">Get Started Now</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="w-full text-accent hover:text-[#d94f33] font-semibold underline"
                        onClick={() => navigate('/pricing')}
                    >
                        Read pricing notes
                    </button>
                </div>
            </div>
        </div>
    );
}

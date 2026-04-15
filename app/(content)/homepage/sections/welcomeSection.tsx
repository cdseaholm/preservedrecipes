'use client'

import { useNavigation } from "@/components/hooks/menu/use-navigation-hook";
import { FaArrowRight, FaBook, FaUsers, FaHeart } from "react-icons/fa";

export default function WelcomeSection() {
    const { navigate } = useNavigation();

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleLearnMore = () => {
        const featuresSection = document.getElementById('features-section');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 bg-mainBack/95 h-content w-full py-20 md:py-28 space-y-8 md:space-y-12">
            {/* Main Heading */}
            <div className="text-start space-y-4 w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mainText leading-tight w-full">
                    Preserve Your Family&apos;s <span className="text-accent">Culinary Legacy</span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-mainText/80 font-medium mx-auto w-full text-start">
                    Create a digital cookbook that keeps cherished recipes alive for generations
                </p>
            </div>

            {/* Value Props - Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-center py-4">
                <div className="flex items-center gap-2 text-mainText/70">
                    <FaBook className="text-accent text-xl" />
                    <span className="font-semibold">Unlimited Recipes</span>
                </div>
                <div className="flex items-center gap-2 text-mainText/70">
                    <FaUsers className="text-accent text-xl" />
                    <span className="font-semibold">Family Sharing</span>
                </div>
                <div className="flex items-center gap-2 text-mainText/70">
                    <FaHeart className="text-accent text-xl" />
                    <span className="font-semibold">100% Free for Initial Users</span>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
                <button 
                    type='button' 
                    className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg hover:bg-[#d94f33] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide bg-accent border-2 border-accent py-4 px-8 cursor-pointer group" 
                    onClick={handleSignUp}
                    aria-label="Get started for free"
                >
                    <span className="text-lg md:text-xl text-white font-semibold">Get Started Free</span>
                    <FaArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                    type='button' 
                    className="flex items-center justify-center w-full sm:w-auto rounded-lg border-2 border-mainText/30 hover:border-accent hover:bg-mainText/5 transition-all duration-300 py-4 px-8 cursor-pointer" 
                    onClick={handleLearnMore}
                    aria-label="Learn more about features"
                >
                    <span className="text-lg md:text-xl text-mainText font-medium">Learn More</span>
                </button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-mainText/60 text-center">
                No credit card required • Forever free plan available for initial users
            </p>
        </div>
    );
}
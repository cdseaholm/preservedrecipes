'use client'

import { useModalStore } from "@/context/modalStore";
import Link from "next/link";
import { FaLightbulb, FaHeart, FaLock } from "react-icons/fa";

export default function AboutSection() {

    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 pt-6 space-y-12">
            {/* Main heading */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    Our Mission
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-3xl mx-auto">
                    No family recipe should ever be lost to time
                </p>
            </div>

            {/* Core values grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaHeart className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Built for Families</h3>
                    <p className="text-base text-mainText/70">
                        {`More than just a recipe app—it's a digital heirloom where families preserve their culinary traditions together.`}
                    </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaLock className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Your Privacy Matters</h3>
                    <p className="text-base text-mainText/70">
                        {`Keep recipes private, share with family only, or make them public. You control who sees your treasured recipes.`}
                    </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaLightbulb className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Always Evolving</h3>
                    <p className="text-base text-mainText/70">
                        {`We're constantly adding new features based on what families need most. Your feedback shapes our roadmap.`}
                    </p>
                </div>
            </div>

            {/* Story section */}
            <div className="w-full bg-mainBack rounded-lg p-8 md:p-12 space-y-6 border border-accent/20 shadow-md">
                <h3 className="text-2xl md:text-3xl font-bold text-mainText text-center">
                    The Story Behind Preserved Recipes
                </h3>
                
                <div className="space-y-4 text-base md:text-lg text-mainText/80 leading-relaxed">
                    <p>
                        {`Preserved Recipes was born from a simple belief: <span className="font-semibold text-accent">no family secret should be left behind</span>. 
                        We've all experienced that moment—trying to recreate a beloved dish from memory, wishing we had written down 
                        Grandma's exact instructions, or discovering a handwritten recipe card that brings back floods of memories.`}
                    </p>
                    
                    <p>
                        {`This platform is more than just a digital cookbook. It's a place where families, individuals, and 
                        eventually communities can come together to preserve what matters most—the recipes that tell our stories, 
                        celebrate our heritage, and bring us together around the table.`}
                    </p>

                    <p>
                        {`Whether you want to keep your family's secret sauce truly secret, share it with the world, or 
                        anything in between, Preserved Recipes gives you complete control. Your recipes, your rules.`}
                    </p>
                </div>
            </div>

            {/* Coming soon & feedback section */}
            <div className="w-full bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg p-8 border-2 border-accent/30 space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-mainText text-center">
                    {`What's Next for Preserved Recipes?`}
                </h3>
                
                <p className="text-base md:text-lg text-mainText/70 text-center max-w-2xl mx-auto">
                    {`We have exciting features in development, including enhanced community features, 
                    meal planning tools, and much more. Want to see what's coming or share your ideas?`}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                        href="/upcoming"
                        className="px-6 py-3 bg-accent hover:bg-[#d94f33] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        View Upcoming Features
                    </Link>
                    
                    <button
                        type="button"
                        className="px-6 py-3 bg-white hover:bg-gray-50 text-accent border-2 border-accent font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                        onClick={() => setOpenInquiryModal(true)}
                    >
                        Share Your Ideas
                    </button>
                </div>

                <p className="text-sm text-mainText/60 text-center">
                    {`Have a feature request or suggestion? We'd love to hear from you!`}
                </p>
            </div>

            {/* Final thank you message */}
            <div className="text-center space-y-2 pt-8">
                <p className="text-lg md:text-xl text-mainText font-medium">
                    Thank you for taking interest in Preserved Recipes
                </p>
                <p className="text-base text-mainText/70">
                    Join us in preserving culinary traditions for generations to come
                </p>
            </div>
        </div>
    )
};
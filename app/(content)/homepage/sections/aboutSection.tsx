'use client'

import { useModalStore } from "@/context/modalStore";
import { FaHeart, FaLightbulb, FaLock } from "react-icons/fa";

export default function AboutSection() {

    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 pt-6 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    Our Mission
                </h2>
                <p className="text-lg md:text-xl text-mainText/70 max-w-3xl mx-auto">
                    No family recipe should ever be lost to time
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaHeart className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Built for Families</h3>
                    <p className="text-base text-mainText/70">
                        More than just a recipe app, it is a place to begin turning scattered family favorites into a lasting archive.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaLock className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Your Privacy Matters</h3>
                    <p className="text-base text-mainText/70">
                        The MVP starts with a private-first recipe collection, so your treasured recipes are not treated like public content by default.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-mainBack rounded-lg border border-accent/20 hover:shadow-lg transition-all">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <FaLightbulb className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-mainText">Shaped by Feedback</h3>
                    <p className="text-base text-mainText/70">
                        RecipeSafe is still early. Feedback from real cooks and families will shape what gets built next.
                    </p>
                </div>
            </div>

            <div className="w-full bg-mainBack rounded-lg p-8 md:p-12 space-y-6 border border-accent/20 shadow-md">
                <h3 className="text-2xl md:text-3xl font-bold text-mainText text-center">
                    The Story Behind RecipeSafe
                </h3>

                <div className="space-y-4 text-base md:text-lg text-mainText/80 leading-relaxed">
                    <p>
                        RecipeSafe began as Preserved Recipes, a simple project built around one belief: no family secret should be left behind. We have all had that moment, trying to recreate a beloved dish from memory, wishing we had written down Grandma&apos;s exact instructions, or discovering a handwritten recipe card that brings back floods of memories.
                    </p>

                    <p>
                        This platform is starting as a focused digital cookbook. It is a place where families and individuals can preserve what matters most: the recipes that tell our stories, celebrate our heritage, and bring us together around the table.
                    </p>

                    <p>
                        The first priority is getting the basics right: saving recipes clearly, finding them easily, and keeping the experience calm enough to use often.
                    </p>
                </div>
            </div>

            <div className="w-full bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg p-8 border-2 border-accent/30 space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-mainText text-center">
                    What&apos;s Next for RecipeSafe?
                </h3>

                <p className="text-base md:text-lg text-mainText/70 text-center max-w-2xl mx-auto">
                    The current focus is a dependable MVP for personal recipe preservation. Once that foundation feels right, family sharing and community features can grow from real user needs.
                </p>

                <p className="text-xs md:text-sm text-mainText/60 text-center max-w-2xl mx-auto">
                    RecipeSafe is not affiliated with, endorsed by, or sponsored by RecipeSage. RecipeSage is the name of a separate recipe-management product.
                </p>

                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="px-6 py-3 bg-white hover:bg-gray-50 text-accent border-2 border-accent font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                        onClick={() => setOpenInquiryModal(true)}
                    >
                        Share Your Ideas
                    </button>
                </div>

                <p className="text-sm text-mainText/60 text-center">
                    Have a feature request or suggestion? We&apos;d love to hear from you.
                </p>
            </div>

            <div className="text-center space-y-2 pt-8">
                <p className="text-lg md:text-xl text-mainText font-medium">
                    Thank you for taking interest in RecipeSafe
                </p>
                <p className="text-base text-mainText/70">
                    Join us in preserving culinary traditions for generations to come
                </p>
            </div>
        </div>
    )
};

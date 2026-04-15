'use client'

import { useNavigation } from "@/components/hooks/menu/use-navigation-hook";
import { FaArrowRight } from "react-icons/fa";

export default function CTASection() {
    const { navigate } = useNavigation();

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 py-16 space-y-8 text-center bg-gradient-to-r from-accent to-[#d94f33] rounded-2xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Ready to Preserve Your Family&apos;s Recipes?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                Join families around the world in keeping their culinary traditions alive
            </p>

            <button
                type="button"
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-accent font-bold text-xl py-5 px-10 rounded-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
                onClick={() => navigate('/auth/signup')}
            >
                <span>Start Your Free Account</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-white/80 text-sm">
                Already have an account?{' '}
                <button
                    type="button"
                    className="underline hover:text-white font-semibold"
                    onClick={() => navigate('/auth/signin')}
                >
                    Sign in here
                </button>
            </p>
        </div>
    );
}
'use client'

import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import WelcomeSection from '@/app/(content)/homepage/sections/welcomeSection';
import HowItWorksSection from '@/app/(content)/homepage/sections/howItWorksSection';
import FeaturesSection from '@/app/(content)/homepage/sections/featuresSection';
import TestimonialsSection from '@/app/(content)/homepage/sections/testimonialsSection';
import PricingTeaserSection from '@/app/(content)/homepage/sections/pricingTeaserSection';
import CTASection from '@/app/(content)/homepage/sections/ctaSection';
import dynamic from 'next/dynamic';
import ContentWrapper from '@/components/wrappers/contentWrapper';
import AboutSection from '@/app/(content)/homepage/sections/aboutSection';

const sectionClass = `flex flex-col justify-center px-4 py-20 md:py-32 items-center w-full min-w-screen overflow-hidden`;
const bgImage = `bg-[url(/images/istockphoto-recipebook.jpg)]`;

export default function Homepage() {
    return (
        <ContentWrapper containedChild={false} paddingNeeded={false}>
            {/* Hero Section */}
            <section className={`flex flex-col justify-start items-center w-full min-w-screen overflow-hidden bg-mainBack h-content ${bgImage} bg-no-repeat bg-cover bg-center`}>
                <WelcomeSection />
            </section>

            {/* How It Works Section */}
            <section className={`${sectionClass} bg-altBack/60`}>
                <HowItWorksSection />
            </section>

            {/* Features Section */}
            <section className={`${sectionClass} bg-mainBack`}>
                <FeaturesSection />
            </section>

            {/* Pricing Teaser Section - MOVED UP */}
            <section className={`${sectionClass} bg-altBack/60`}>
                <PricingTeaserSection />
            </section>

            {/* Final CTA Section */}
            <section className={`${sectionClass} bg-gradient-to-b from-mainBack to-transparent`}>
                <CTASection />
            </section>
        </ContentWrapper>
    );
}
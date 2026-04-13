'use client'

import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import WelcomeSection from '@/app/(content)/homepage/sections/welcomeSection';
import dynamic from 'next/dynamic';
import InfoTemplate from '../sections/infoTemplate';
import ContentWrapper from '@/components/wrappers/contentWrapper';

const AboutSection = dynamic(() => import('@/app/(content)/homepage/sections/miscSection'));

const sectionClass = `flex flex-col justify-center px-4 py-32 items-center w-full min-w-screen overflow-hidden`;
const bgImage = `bg-[url(/images/istockphoto-recipebook.jpg)]`;

export default function Homepage() {


    return (
        <ContentWrapper containedChild={false} paddingNeeded={false}>
            <section className={`flex flex-col justify-start items-center w-full min-w-screen overflow-hidden bg-mainBack h-content ${bgImage} bg-no-repeat bg-cover`}>
                <WelcomeSection />
            </section>
            <section className={`${sectionClass} bg-altBack/60`}>
                <InfoTemplate tab={'recipes'} />
            </section>
            <section className={`${sectionClass} bg-mainBack`}>
                <InfoTemplate tab={'family'} />
            </section>
            <section className={`${sectionClass} bg-altBack/60`}>
                <Suspense fallback={<LoadingSpinner />}>
                    <AboutSection id="about-section" />
                </Suspense>
            </section>
        </ContentWrapper>
    );

}
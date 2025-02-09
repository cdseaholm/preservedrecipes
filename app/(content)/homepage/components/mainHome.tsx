'use client'

import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import WelcomeSection from '@/app/(content)/homepage/sections/welcomeSection';

const InfoTemplate = lazy(() => import('@/app/(content)/homepage/sections/infoTemplate'));
const AboutSection = lazy(() => import('@/app/(content)/homepage/sections/miscSection'));

const sectionClass = `flex flex-col justify-center px-4 py-32 items-center w-full min-w-screen overflow-hidden`;
const bgImage = `bg-[url(/images/istockphoto-recipebook.jpg)]`;

export default function Homepage() {

    return (
        <div className='flex flex-col justify-start items-center w-full'>
            <section className={`flex flex-col justify-start items-center w-full min-w-screen overflow-hidden bg-mainBack h-content ${bgImage} bg-no-repeat bg-cover`}>
                <WelcomeSection />
            </section>
            <section className={`${sectionClass} bg-altBack/60`}>
                <Suspense fallback={<LoadingSpinner screen={true} />}>
                    <InfoTemplate tab={'recipes'} />
                </Suspense>
            </section>
            <section className={`${sectionClass} bg-mainBack`}>
                <Suspense fallback={<LoadingSpinner screen={true} />}>
                    <InfoTemplate tab={'family'} />
                </Suspense>
            </section>
            <section className={`${sectionClass} bg-altBack/60`}>
                <Suspense fallback={<LoadingSpinner screen={true} />}>
                    <AboutSection id="about-section" />
                </Suspense>
            </section>
        </div>
    );
}
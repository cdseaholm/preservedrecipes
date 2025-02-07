'use client'

import WelcomeSection from '@/app/(content)/homepage/sections/welcomeSection';
import React from 'react';
import InfoTemplate from '../sections/infoTemplate';
import AboutSection from '../sections/miscSection';

export default function Homepage() {

    const sections = [
        <WelcomeSection key={0} />,
        <InfoTemplate tab={'recipes'} key={1} />,
        <InfoTemplate tab={'family'} key={2} />,
        //<InfoTemplate tab={'communities'} key={3}/>,
        <AboutSection key={4} id="about-section" />
    ] as React.JSX.Element[];

    return (
        sections.map((section: React.JSX.Element, index: number) => {
            return (
                <section className={`flex flex-col ${index === 0 ? 'h-4/5 justify-start' : 'h-content justify-center px-4 py-32'} items-center w-full min-w-screen overflow-hidden ${index % 2 === 0 ? 'bg-mainBack' : 'bg-altBack/60'}`} key={index}>
                    {section}
                </section>
            )
        })
    );
}
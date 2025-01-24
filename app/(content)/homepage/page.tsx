'use client'

import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import InfoTemplate from '@/components/pageSpecifics/homepage/infoSection/infoTemplate';
import AboutSection from '@/components/pageSpecifics/homepage/miscSection';
import WelcomeSection from '@/components/pageSpecifics/homepage/welcomeSection';
import React, { Suspense } from 'react';

export default function Homepage() {

  const sections = [
    <WelcomeSection key={0}/>,
    <InfoTemplate tab={'recipes'} key={1}/>,
    <InfoTemplate tab={'family'} key={2}/>,
    //<InfoTemplate tab={'communities'} key={3}/>,
    <AboutSection key={4} id="about-section" />
  ] as React.JSX.Element[];

  return (
    <Suspense fallback={<LoadingSpinner screen={true} />}>
      {sections.map((section: React.JSX.Element, index: number) => {
        return (
          <section className={`flex flex-col ${index === 0 ? 'h-4/5 justify-start' : 'h-content justify-center px-4 py-32'} items-center w-full min-w-screen overflow-hidden ${index % 2 === 0 ? 'bg-mainBack' : 'bg-altBack/60'}`} key={index}>
            {section}
          </section>
        )
      })}
    </Suspense>
  );
}
'use client'

import InfoSection from '@/components/templates/homepage/infoSection';
import MiscSection from '@/components/templates/homepage/miscSection';
import WelcomeSection from '@/components/templates/homepage/welcomeSection';
import React from 'react';

export default function Home() {

  const sections = [
    <WelcomeSection />,
    <InfoSection />,
    <MiscSection />
  ] as React.JSX.Element[]

  return (
      sections.map((section: React.JSX.Element, index: number) => {
        return (
          <section className="bg-gray-50 flex flex-col justify-center items-center w-full h-full" key={index}>
            {section}
          </section>
        )
      })
  );
}
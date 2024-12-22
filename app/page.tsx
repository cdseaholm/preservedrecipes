'use client'

import InfoSection from '@/components/pageSpecifics/homepage/infoSection';
import AboutSection from '@/components/pageSpecifics/homepage/miscSection';
import WelcomeSection from '@/components/pageSpecifics/homepage/welcomeSection';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function Home() {
  const { data: session } = useSession();
  const user = session ? session?.user as User : null;

  const sections = [
    <WelcomeSection user={user} key={0} />,
    <InfoSection key={1} />,
    <AboutSection key={2} id="about-section" />
  ] as React.JSX.Element[];

  return (
    sections.map((section: React.JSX.Element, index: number) => {
      return (
        <section className={`flex flex-col justify-center items-center w-full min-h-[600px] h-full min-w-[300px] overflow-x-auto ${index === 1 ? 'bg-altBack' : 'bg-mainBack'}`} key={index}>
          {section}
        </section>
      )
    })
  );
}
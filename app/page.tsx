'use client'

import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import InfoSection from '@/components/pageSpecifics/homepage/infoSection';
import AboutSection from '@/components/pageSpecifics/homepage/miscSection';
import WelcomeSection from '@/components/pageSpecifics/homepage/welcomeSection';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Home({ searchParams }: { searchParams: { section?: string } }) {

  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true)
  const user = session ? session?.user as User : null;

  const sections = [
    <WelcomeSection user={user} key={0} />,
    <InfoSection key={1} />,
    <AboutSection key={2} id="about-section" />
  ] as React.JSX.Element[];

  useEffect(() => {
    if (!searchParams.section) {
      setLoading(false);
      return;
    } else {
      setLoading(false);
      if (!searchParams) {
        return;
      }
      let elementID = searchParams.section as string;
      setTimeout(() => {
        document.getElementById(elementID)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams, searchParams.section]);

  return (
    loading ? (
      <LoadingSpinner />
    ) :
      sections.map((section: React.JSX.Element, index: number) => {
        return (
          <section className={`flex flex-col justify-center items-center w-full h-full ${index === 1 ? 'bg-altBack' : 'bg-mainBack'}`} key={index}>
            {section}
          </section>
        )
      })
  );
}
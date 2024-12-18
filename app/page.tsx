'use client'

import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import InfoSection from '@/components/pageSpecifics/homepage/infoSection';
import MiscSection from '@/components/pageSpecifics/homepage/miscSection';
import WelcomeSection from '@/components/pageSpecifics/homepage/welcomeSection';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Home() {

  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true)
  const user = session ? session?.user as User : null;

  const sections = [
    <WelcomeSection user={user} key={0}/>,
    <InfoSection key={1}/>,
    <MiscSection key={2}/>
  ] as React.JSX.Element[];

  useEffect(() => {
    setLoading(false);
  }, [])

  return (
    loading ? (
      <LoadingSpinner />
    ) :
      sections.map((section: React.JSX.Element, index: number) => {
        return (
          <section className={`flex flex-col justify-center items-center w-full h-full ${index === 1 ? 'bg-mainText/70' : 'bg-mainBack'}`} key={index}>
            {section}
          </section>
        )
      })
  );
}
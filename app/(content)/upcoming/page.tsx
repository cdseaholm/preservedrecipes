import FeaturesPage from '@/components/pageSpecifics/features/featuresPage';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Upcoming Features List`,
        description: `A Page for to showcase, manage, and accept new ideas regarding upcoming features`,
    };
}

export default async function Page() {

    return (
        <FeaturesPage />
    );
}
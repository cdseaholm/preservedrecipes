import { Metadata } from 'next';
import React from 'react';
import FeaturesPage from './components/features';

export function generateMetadata(): Metadata {
    return {
        title: `Upcoming Features List`,
        description: `A Page for to showcase, manage, and accept new ideas regarding upcoming features`,
    };
}

export default function Page() {

    return (
        <FeaturesPage />
    );
}
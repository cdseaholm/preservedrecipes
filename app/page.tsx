import React from 'react';
import { Metadata } from 'next';
import Homepage from './(content)/homepage/components/mainHome';

export function generateMetadata(): Metadata {

  return {
    title: `Home Page for Preserved Recipes`,
    description: `Home Page for information about preserved recipes and more`,
  };
}

export default function Page() {

  return (
    <Homepage />
  );
}
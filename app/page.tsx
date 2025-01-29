import React from 'react';
import { Metadata } from 'next';
import Homepage from './(content)/homepage/page';

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Home Page for Preserved Recipes`,
    description: `Home Page for information about preserved recipes and more`,
  };
}

export default async function Page() {

  return (
    <Homepage />
  );
}
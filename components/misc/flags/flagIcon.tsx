import React from 'react';
import Flagpack from 'react-flagpack';

export const FlagIcon = ({ countryCode }: { countryCode: string }) => {
    return <Flagpack code={countryCode} size='S' className='h-content w-content'/>;
};
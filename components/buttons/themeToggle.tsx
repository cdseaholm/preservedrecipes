'use client'

import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { rem, Switch } from '@mantine/core';

const sunIcon = (
  <IconSun
    style={{ width: rem(16), height: rem(16) }}
    stroke={2.5}
    color={`#a8860c`}
  />
);

const moonIcon = (
  <IconMoonStars
    style={{ width: rem(16), height: rem(16) }}
    stroke={2.5}
    color={`#c0cafa`}
  />
);

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Switch size="md" color="dark.4" onLabel={moonIcon} offLabel={sunIcon} onClick={toggleTheme} aria-label='Color theme switch'/>
    );
}
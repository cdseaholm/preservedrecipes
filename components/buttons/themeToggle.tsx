'use client'

import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Group, rem, Switch, Text, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

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
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const isDarkMode = computedColorScheme === 'dark';

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    return (
        <Group justify="space-between" gap="md" className="w-full rounded-md border border-accent/20 bg-cardBack/80 px-4 py-3 text-mainText shadow-sm">
            <div>
                <Text fw={700} size="sm">Theme</Text>
                <Text size="xs" c="dimmed">{isDarkMode ? 'Dark cookbook mode' : 'Light cookbook mode'}</Text>
            </div>
            <Switch
                size="md"
                color="accent"
                checked={isDarkMode}
                onLabel={moonIcon}
                offLabel={sunIcon}
                onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
                aria-label='Color theme switch'
            />
        </Group>
    );
}

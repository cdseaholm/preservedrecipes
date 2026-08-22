'use client'

import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

export default function ThemeClassProvider() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        if (!localStorage.getItem('preserved-recipes-theme-defaulted')) {
            setColorScheme('light');
            localStorage.setItem('preserved-recipes-theme-defaulted', 'true');
        }
    }, [setColorScheme]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', computedColorScheme === 'dark');
    }, [computedColorScheme]);

    return null;
}

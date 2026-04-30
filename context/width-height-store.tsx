import { useState, useEffect } from 'react';

export function useWindowSizes() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width,
        height,
        mounted,
    };
}
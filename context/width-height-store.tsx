import { useState, useEffect } from 'react';

export function useWindowSizes() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width: width,
        height: height,
    };
}

// return {
//         width: width,
//         isMobile: width < 640,
//         isTablet: width >= 640 && width < 1024,
//         isDesktop: width >= 1024,
//         height: height,
//     };
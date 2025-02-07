'use client'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'


export const RouterTransition = () => {
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState('');
    const [beginLoad, setBeginLoad] = useState(false);

    useEffect(() => {
        if (pathname !== prevPathname) {
            nprogress.start();
            setPrevPathname(pathname);
            setBeginLoad(true);
        }
    }, [pathname, prevPathname]);

    useEffect(() => {
        if (beginLoad) {
            setBeginLoad(false);
            setTimeout(() => {
                nprogress.complete();
            }, 100);
        }
    }, [beginLoad]);

    return <NavigationProgress color={'cyan'} aria-label='Loading bar'/>
}
'use client'

import { nprogress } from '@mantine/nprogress'
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const NavigationProgress = dynamic(() => import('@mantine/nprogress').then((mod) => mod.NavigationProgress));

export default function RouterTransition() {
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

    return <NavigationProgress color={'cyan'} aria-label='Loading bar' />
}
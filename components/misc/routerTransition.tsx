'use client'

import { nprogress } from '@mantine/nprogress'
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useStateStore } from '@/context/stateStore';

const NavigationProgress = dynamic(() => import('@mantine/nprogress').then((mod) => mod.NavigationProgress));

export default function RouterTransition() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const routeKey = `${pathname}?${searchParams.toString()}`;
    const [prevRouteKey, setPrevRouteKey] = useState('');
    const [beginLoad, setBeginLoad] = useState(false);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);

    useEffect(() => {
        if (routeKey !== prevRouteKey) {
            nprogress.start();
            setPrevRouteKey(routeKey);
            setBeginLoad(true);
        }
    }, [routeKey, prevRouteKey]);

    useEffect(() => {
        if (beginLoad) {
            setBeginLoad(false);
            setTimeout(() => {
                nprogress.complete();
                setIsNavigating(false);
            }, 100);
        }
    }, [beginLoad, setIsNavigating]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const target = event.target as HTMLElement | null;
            const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
            if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

            const nextUrl = new URL(anchor.href, window.location.href);
            const currentUrl = new URL(window.location.href);
            if (nextUrl.origin !== currentUrl.origin) return;
            if (`${nextUrl.pathname}${nextUrl.search}` === `${currentUrl.pathname}${currentUrl.search}`) return;

            setIsNavigating(true);
            nprogress.start();
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [setIsNavigating]);

    return <NavigationProgress color={'cyan'} aria-label='Loading bar' />
}

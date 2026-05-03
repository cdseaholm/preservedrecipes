'use client'

import { useSession } from "next-auth/react";
import { Box, LoadingOverlay } from "@mantine/core";
import ModalProvider from "../providers/modalProvider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStateStore } from "@/context/stateStore";

export default function StateWrapper({ children }: { children: React.ReactNode }) {


    const { data: session, update } = useSession();
    const pathname = usePathname();
    const isNavigating = useStateStore(state => state.isNavigating);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);

    const handleUpdate = async () => {
        await update();
    };

    useEffect(() => {
        setIsNavigating(false);
        setGlobalLoading(false);
    }, [pathname, setIsNavigating, setGlobalLoading]);

    return (
        <Box pos={'relative'} w={'100dvw'} h={'100dvh'}>
            <LoadingOverlay
                visible={isNavigating}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 0, bg: '#E8D8C4' }}
            />
            <ModalProvider session={session} handleUpdate={handleUpdate} />
            {children}
        </Box>
    );
}

'use client'

import { useSession } from "next-auth/react";
import { Box, LoadingOverlay } from "@mantine/core";
import ModalProvider from "../providers/modalProvider";
import ToasterWrapper from "./dynamicWrappers/toasterWrapper";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStateStore } from "@/context/stateStore";

export default function StateWrapper({ children }: { children: React.ReactNode }) {


    const { data: session, status, update } = useSession();
    const pathname = usePathname();
    const isNavigating = useStateStore(state => state.isNavigating);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);

    const handleUpdate = async () => {
        await update();
    };

    const isLoading = status === 'loading';

    useEffect(() => {
        setIsNavigating(false);
    }, [pathname, setIsNavigating]);

    return (
        <Box pos={'relative'} w={'100dvw'} h={'100dvh'}>
            <LoadingOverlay
                visible={isLoading || isNavigating}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 0, bg: '#E8D8C4' }}
            />
            <ModalProvider session={session} handleUpdate={handleUpdate} />
            {children}
            <ToasterWrapper />
        </Box>
    );
}

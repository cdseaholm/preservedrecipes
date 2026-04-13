'use client'

import { useSession } from "next-auth/react";
import { Box, LoadingOverlay } from "@mantine/core";
import ModalProvider from "../providers/modalProvider";
import ToasterWrapper from "./dynamicWrappers/toasterWrapper";

export default function StateWrapper({ children }: { children: React.ReactNode }) {


    const { data: session, status, update } = useSession();

    const handleUpdate = async () => {
        await update();
    };

    const isLoading = status === 'loading';

    return (
        <Box pos={'relative'} w={'100dvw'} h={'100dvh'}>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 0, bg: '#E8D8C4' }}
            />
            <ModalProvider session={session} handleUpdate={handleUpdate} />
            {children}
            <ToasterWrapper />
        </Box>
    );
}
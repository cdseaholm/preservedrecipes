import { Box, LoadingOverlay } from "@mantine/core";

export default function Loading() {
    return (
        <Box pos={'relative'} w={'100dvw'} h={'100dvh'}>
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 0, bg: '#E8D8C4' }}
            />
        </Box>
    );
}
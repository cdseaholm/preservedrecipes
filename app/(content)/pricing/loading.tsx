import { Box, LoadingOverlay } from "@mantine/core";

export default function Loading() {
    return (
        <Box pos={'relative'} w={'100%'} h={'100%'}>
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
        </Box>
    );
}
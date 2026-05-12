import { Center, Loader } from "@mantine/core";

export default function PageLoadingPanel() {
    return (
        <Center className="min-h-[60dvh] w-full rounded-md bg-cardBack/70 sm:min-h-[70dvh]">
            <Loader color="blue" />
        </Center>
    );
}

import { Loader } from "@mantine/core";

export function LoadingSpinner({ screen }: { screen: boolean }) {
    return (
        <section className={`flex flex-row rounded-full animate-pulse ${screen ? 'min-h-screen min-w-screen' : 'h-full w-full'} justify-center items-center p-2`}>
            <Loader color="orange" />
        </section>
    );
}
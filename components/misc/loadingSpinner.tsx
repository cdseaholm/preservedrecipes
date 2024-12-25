import { Loader } from "@mantine/core";

export function LoadingSpinner() {
    return (
        <section className="flex flex-row rounded-full animate-pulse min-h-screen min-w-screen justify-center items-center p-2">
            <Loader color="orange" />
        </section>
    );
}
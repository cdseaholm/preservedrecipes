import { Loader } from "@mantine/core";

export function LoadingSpinner() {
    return (
        <section className="flex flex-row rounded-full animate-pulse h-full w-full justify-center items-center p-2">
            <Loader color="orange" />
        </section>
    );
}
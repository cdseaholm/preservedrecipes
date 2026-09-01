'use client'

import { Loader } from "@mantine/core";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
    buttonTitle,
    loading = false,
    disabled = false,
    loadingTitle,
    fullWidth = false,
}: {
    buttonTitle: string;
    loading?: boolean;
    disabled?: boolean;
    loadingTitle?: string;
    fullWidth?: boolean;
}) {
    const { pending } = useFormStatus();
    const isLoading = loading || pending;
    const label = isLoading ? loadingTitle || `${buttonTitle}...` : buttonTitle;

    return (
        <button
            type='submit'
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-blue-400 p-2 text-xs transition-colors hover:bg-blue-200 disabled:cursor-wait disabled:opacity-70 sm:text-sm ${fullWidth ? 'w-full' : 'w-full sm:w-1/5'}`}
            aria-label={label}
            aria-busy={isLoading}
            disabled={disabled || isLoading}
        >
            {isLoading && <Loader size="xs" color="dark" />}
            {label}
        </button>
    )
}

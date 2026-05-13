import type { HelperResponse } from "./delete/deleteUser";

type ApiEnvelope<T> = {
    status?: number | boolean;
    message?: string;
} & T;

export type ApiHelperResponse<T = object> = HelperResponse & T;

export async function readApiResponse<T extends object>(
    response: Response,
    fallbackMessage: string
): Promise<ApiHelperResponse<{ data: ApiEnvelope<T> | null }>> {
    const data = await response.json().catch(() => null) as ApiEnvelope<T> | null;
    const message = data?.message || response.statusText || fallbackMessage;

    if (!response.ok) {
        return { status: false, message, data };
    }

    if (!data) {
        return { status: false, message: `${fallbackMessage}: invalid response`, data: null };
    }

    if (data.status !== undefined && data.status !== 200 && data.status !== true) {
        return { status: false, message: data.message || fallbackMessage, data };
    }

    return { status: true, message, data };
}

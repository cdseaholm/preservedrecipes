import { normalizeEmail } from "./data-normalization";

const DEFAULT_APP_ADMIN_EMAIL = 'cdseaholm@gmail.com';

export function normalizeAdminEmail(email: string | null | undefined) {
    return normalizeEmail(email);
}

export function getAppAdminEmail() {
    return normalizeAdminEmail(process.env.ADMIN_USERNAME || DEFAULT_APP_ADMIN_EMAIL);
}

export function isAppAdminEmail(email: string | null | undefined) {
    return normalizeAdminEmail(email) === getAppAdminEmail();
}

export const getInquiryAdminEmail = getAppAdminEmail;
export const isInquiryAdminEmail = isAppAdminEmail;

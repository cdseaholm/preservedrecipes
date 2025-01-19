'use client'

import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { Session, User } from "next-auth";

export const handleZoomReset = async (open: boolean) => {
    useStateStore.getState().handleZoomReset(useStateStore.getState().widthQuery, open);
};

export const handleZoomClick = async () => {
    await handleZoomReset(true);
};

export const handleZoomClose = async () => {
    await handleZoomReset(false);
};

export const handleSignOutModal = (open: boolean) => {
    useModalStore.getState().setOpenSignOutModal(open);
};

export const handleSignInModal = (open: boolean) => {
    useModalStore.getState().setOpenSignInModal(open);
};

export const handleRegisterModal = (open: boolean) => {
    useModalStore.getState().setOpenRegisterModal(open);
};

export const getFirstName = (session: Session | null) => {
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    return userName ? userName.split(' ')[0] : null;
};
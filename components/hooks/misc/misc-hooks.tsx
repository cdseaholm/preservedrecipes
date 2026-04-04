'use client'

import { Session, User } from "next-auth";

export const getFirstName = (session: Session | null) => {
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    return userName ? userName.split(' ')[0] : null;
};
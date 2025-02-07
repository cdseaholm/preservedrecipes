import { IUser } from "@/models/types/user";
import { InitializeUserData } from "@/utils/apihelpers/get/initUserData";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import ProfilePage from "./components/mainProfile";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: userName ? `${userName}'s Profile - Preserved Recipes` : 'Profile - Preserved Recipes',
        description: userName ? `Profile page for ${userName} on Preserved Recipes` : 'Profile page on Preserved Recipes',
    };
}

async function InitAdminData(admin: string) {
    const session = await getServerSession();


    const initialized = await InitializeUserData() as { status: boolean, message: string };

    if (!initialized || initialized.status === false) {
        return;
    }

    if (!session) {
        return false;
    }

    const user = session.user as IUser;
    if (!user) {
        return false;
    }

    const email = user.email as string;
    if (admin === email) {
        return true;
    }

    return false;
}

export default async function Page() {
    const admin = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME as string : 'null';
    const adminHere = await InitAdminData(admin) as boolean;

    return (
        <Suspense fallback={<LoadingSpinner screen={true} />}>
            <ProfilePage admin={adminHere} />
        </Suspense>
    );
}
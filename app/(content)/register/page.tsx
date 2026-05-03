import { Metadata } from "next";
import RegisterPage from "./components/mainRegister";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/data/user";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Register",
    description: "Create a Preserved Recipes account to save recipes, join family recipe spaces, and participate in cooking communities.",
});

export default async function Page() {

    const userInfo = await getSessionUser();

    if (userInfo) {
        redirect("/u/profile");
    }

    return (
        <RegisterPage userInfo={null} />
    );
}

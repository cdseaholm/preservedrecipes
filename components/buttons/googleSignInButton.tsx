'use client'

import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
    const handleGoogleSignIn = () => {
        void signIn('google', { callbackUrl: '/u/profile' });
    };

    return (
        <Button
            type="button"
            variant="outline"
            color="gray"
            leftSection={<IconBrandGoogle size={18} />}
            onClick={handleGoogleSignIn}
            className="w-full"
        >
            {label}
        </Button>
    );
}

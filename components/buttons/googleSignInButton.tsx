'use client'

import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
    const [redirecting, setRedirecting] = useState(false);

    const handleGoogleSignIn = () => {
        setRedirecting(true);
        void signIn('google', { callbackUrl: '/u/profile' });
    };

    return (
        <Button
            type="button"
            variant="outline"
            color="gray"
            leftSection={<IconBrandGoogle size={18} />}
            onClick={handleGoogleSignIn}
            loading={redirecting}
            disabled={redirecting}
            className="w-full"
        >
            {redirecting ? 'Redirecting...' : label}
        </Button>
    );
}

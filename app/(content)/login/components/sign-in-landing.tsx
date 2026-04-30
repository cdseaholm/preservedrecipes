'use client'

import SignInPage from "@/components/modals/intercepted-components/mainLogin";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInLanding() {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = () => {
        router.push('/');
    }

    const handleLoading = (loadState: boolean) => {
        setLoading(loadState);
    }

    return (
        <NavWrapper loadingChild={<LoadingOverlay visible={loading} />} userInfo={null}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <SignInPage handleCancel={handleCancel} handleLoading={handleLoading} />
            </ContentWrapper>
        </NavWrapper>
    );
} 

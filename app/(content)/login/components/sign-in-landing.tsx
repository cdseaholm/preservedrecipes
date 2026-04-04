'use client'

import SignInPage from "@/components/modals/intercepted-components/mainLogin";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useState } from "react";

export default function sstSignInLanding() {

    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        // Implement cancel logic if needed
    }

    const handleLoading = (loadState: boolean) => {
        setLoading(loadState);
    }

    return (
        <NavWrapper loadingChild={loading} userInfo={null}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <SignInPage handleCancel={handleCancel} handleLoading={handleLoading} />
            </ContentWrapper>
        </NavWrapper>
    );
} 
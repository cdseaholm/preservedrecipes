'use client'

import SignInPage from "@/components/modals/intercepted-components/mainLogin";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useStateStore } from "@/context/stateStore";
import { useRouter } from "next/navigation";

export default function SignInLanding() {

    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
    const router = useRouter();

    const handleCancel = () => {
        router.push('/');
    }

    const handleLoading = (loadState: boolean) => {
        setGlobalLoading(loadState);
    }

    return (
        <NavWrapper userInfo={null}>
            <ContentWrapper containedChild={false} paddingNeeded={true}>
                <SignInPage handleCancel={handleCancel} handleLoading={handleLoading} />
            </ContentWrapper>
        </NavWrapper>
    );
} 

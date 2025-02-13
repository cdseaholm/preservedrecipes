import "@/app/globals.css";
import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import AuthWrapper from "@/components/wrappers/authwrapper";
import StateWrapper from "@/components/wrappers/stateWrapper";
import ModalWrapper from "@/components/wrappers/dynamicWrappers/modalWrapper";
import FooterWrapper from "@/components/wrappers/dynamicWrappers/footerWrapper";
import ToasterWrapper from "@/components/wrappers/dynamicWrappers/toasterWrapper";
import ColorScriptWrapper from "@/components/wrappers/dynamicWrappers/colorScriptWrapper";
import MantineWrapper from "@/components/wrappers/dynamicWrappers/mantineWrapper";
import RouterTransitionWrapper from "@/components/wrappers/dynamicWrappers/routerTransitionWrapper";
import AppHeader from "@/components/nav/header/appHeader";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <ColorScriptWrapper />
      </head>
      <body className="h-screen w-screen overflow-hidden bg-mainBack">
        <MantineWrapper>
          <AuthWrapper>
            <AppHeader />
            <RouterTransitionWrapper />
            <StateWrapper>
              {children}
              <FooterWrapper />
            </StateWrapper>
            <ModalWrapper />
            <ToasterWrapper />
          </AuthWrapper>
        </MantineWrapper>
      </body>
    </html>
  );
}
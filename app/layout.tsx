import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import AuthWrapper from "@/components/wrappers/authwrapper";
import { RouterTransition } from "@/components/misc/routerTransition";
import StateWrapper from "@/components/wrappers/stateWrapper";
import AppHeader from "@/components/nav/header/appHeader";
import { lazy } from "react";

const Toaster = lazy(() => import("sonner").then(module => ({ default: module.Toaster })));
const ModalProvider = lazy(() => import('@/components/providers/modalProvider'));
const MainFooter = lazy(() => import('@/components/nav/footer'))

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="h-screen w-screen overflow-hidden bg-foreground">
        <MantineProvider>
          <RouterTransition />
          <AuthWrapper>
            <AppHeader />
            <RouterTransition />
            <StateWrapper>
              {children}
              <MainFooter />
            </StateWrapper>
            <ModalProvider />
            <Toaster />
          </AuthWrapper>
        </MantineProvider>
      </body>
    </html>
  );
}
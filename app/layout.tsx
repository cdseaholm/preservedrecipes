import "@/app/globals.css";
import { Toaster } from "sonner";
import PageWrapper from "@/components/templates/wrappers/pageWrapper";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AuthWrapper from "@/components/templates/wrappers/authwrapper";
import MainHeader from "@/components/nav/header";
import ModalProvider from "@/components/providers/modalProvider";

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
      <body className="h-screen w-screen overflow-hidden bg-mainBack">
        <AuthWrapper>
          <MantineProvider>
            <MainHeader />
            <PageWrapper>
              {children}
            </PageWrapper>
            <ModalProvider />
          </MantineProvider>
          <Toaster />
        </AuthWrapper>
      </body>
    </html>
  );
}
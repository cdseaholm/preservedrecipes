import "@/app/globals.css";
import { Toaster } from "sonner";
import PageWrapper from "@/components/wrappers/pageWrapper";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AuthWrapper from "@/components/wrappers/authwrapper";
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
        <MantineProvider>
          <AuthWrapper>
            <MainHeader />
            <PageWrapper>
              {children}
            </PageWrapper>
            <ModalProvider />
            <Toaster />
          </AuthWrapper>
        </MantineProvider>
      </body>
    </html>
  );
}
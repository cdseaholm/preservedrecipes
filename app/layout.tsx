import "@/app/globals.css";
import { Toaster } from "sonner";
import PageWrapper from "@/components/templates/wrappers/pageWrapper";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AuthWrapper from "@/components/templates/wrappers/authwrapper";

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
      <body className="overflow-hidden bg-mainBack">
        <AuthWrapper>
          <MantineProvider>
            <PageWrapper>
              {children}
            </PageWrapper>
          </MantineProvider>
          <Toaster />
        </AuthWrapper>
      </body>
    </html>
  );
}
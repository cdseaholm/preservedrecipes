
//import { Inter } from "next/font/google";
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/core/styles.css';
import "@/app/globals.css";
import AuthWrapper from "@/components/wrappers/authwrapper";
import StateWrapper from "@/components/wrappers/stateWrapper";
import ToasterWrapper from "@/components/wrappers/dynamicWrappers/toasterWrapper";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from './api/uploadthing/core';
import { defaultSiteMetadata } from '@/lib/metadata';
import ThemeClassProvider from '@/components/providers/themeClassProvider';

//const inter = Inter({ subsets: ["latin"] });
//<html lang="en" className={inter.className} suppressHydrationWarning>

export const metadata = defaultSiteMetadata;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className="overflow-hidden">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <AuthWrapper>
          <MantineProvider defaultColorScheme="light">
              <ThemeClassProvider />
              <StateWrapper>
                {children}
              </StateWrapper>
          </MantineProvider>
          <ToasterWrapper />
        </AuthWrapper>
      </body>
    </html>
  );
}

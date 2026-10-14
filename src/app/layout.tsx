import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { clientEnv } from "@/config/env.client";
// vercel analytics and SpeedInsights
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${clientEnv.NEXT_PUBLIC_APP_NAME} | Real Estate Management`,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "Discover properties and manage real estate operations with ${clientEnv.NEXT_PUBLIC_APP_NAME}.",
  applicationName: `${clientEnv.NEXT_PUBLIC_APP_NAME}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("propora-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`,
          }}
        /> */}

        <ThemeProvider>{children}</ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

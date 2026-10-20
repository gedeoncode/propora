import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { clientEnv } from "@/config/env.client";
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

const themeStorageKey = `${clientEnv.NEXT_PUBLIC_APP_THEME_NAME}`;

export const metadata: Metadata = {
  title: {
    default: `${clientEnv.NEXT_PUBLIC_APP_NAME} | Real Estate Management`,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: `Discover properties and manage real estate operations with ${clientEnv.NEXT_PUBLIC_APP_NAME}.`,
  applicationName: clientEnv.NEXT_PUBLIC_APP_NAME,
};

const themeScript = `
(function () {
  try {
    var key = ${JSON.stringify(themeStorageKey)};
    var storedTheme = localStorage.getItem(key);
    var validTheme =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system";

    var theme = validTheme ? storedTheme : "system";
    var isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <ThemeProvider>{children}</ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
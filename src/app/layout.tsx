import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/utils/ThemeContext";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin Events & Community",
  description: "Discover Bitcoin community events, organizers, and connect with fellow Bitcoiners",
  manifest: "/manifest.json",
  themeColor: "#f7931a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bitcoin Events",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bitcoin Events" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <PWAProvider>
            <Navbar />
            {children}
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

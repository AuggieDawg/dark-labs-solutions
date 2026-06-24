import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { APP_CONFIG } from "@/config/app";

import "./globals.css";

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
    default: `${APP_CONFIG.companyName} | Intelligent Business Systems`,
    template: `%s | ${APP_CONFIG.companyName}`,
  },
  description:
    "Dark Labs builds intelligent websites, automations, dashboards, and private operating platforms for businesses that need modern digital infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

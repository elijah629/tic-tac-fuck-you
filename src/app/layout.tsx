import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Cursor } from "@/components/cursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isHardcore } from "@/lib/auth";
import React from "react";
import { Falling } from "@/components/falling";
import { Settings } from "@/components/settings";
import Soundtrack from "@/components/soundtrack";
import styles from "@/components/crt.module.css";
import CrtFilter from "@/components/crt-filter";

const m6x11 = localFont({
  src: "../assets/fonts/m6x11plus.ttf",
  variable: "--font-m6x11",
  adjustFontFallback: false,
});

const serenityOSEmoji = localFont({
  src: "../assets/fonts/SerenityOS-Emoji.ttf",
  variable: "--font-emoji",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tic-tac-fuck-you.vercel.app"),
  title: "Tic Tac Fuck You",
  description: "Tic Tac Toe + Balatro + AI",
  openGraph: {
    siteName: "Tic Tac Fuck You",
    url: "https://tic-tac-fuck-you.vercel.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hardcore = await isHardcore();
  const icon = hardcore ? "🖕" : "🫶";

  return (
    <html lang="en">
      <body
        className={`${m6x11.variable} ${serenityOSEmoji.variable} ${styles.textShadow} h-screen select-none text-2xl antialiased dark`}
        style={{
          fontFamily: `var(--font-m6x11), system-ui, var(--font-emoji)`,
        }}
      >
        {/* Since filters create a new block, and fixed is fixed to the parent block, we cannot combine the two
          SOLUTION: backdrop-filter! We make one top-level overlay which stores every effect we need, then we make it transparent so it applies to everything under it!
        */}
        <CrtFilter />

        <Cursor cursor={icon} />
        <Settings />

        {/* Page content */}
        <div className="flex flex-col h-screen">
          <Navbar logo={icon} />
          {children}
        </div>

        {/* Scripts & Assets */}
        <>
          <Analytics />
          <SpeedInsights />
          <Soundtrack /> {/* <audio> node */}
        </>

        {/* Background */}
        <>
          {/* no hydration error since client does not rerender layout */}
          <Falling />
        </>
      </body>
    </html>
  );
}

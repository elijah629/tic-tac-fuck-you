import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./crt.module.css";
import { Navbar } from "@/components/navbar";
import { Cursor } from "@/components/cursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isHardcore } from "@/lib/auth";
import React from "react";
import { Falling } from "@/components/falling";
import { Settings } from "@/components/settings";
import Soundtrack from "@/components/soundtrack";
//import sphere from "@/assets/images/sphere.png";

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
    <html lang="en" className="saturate-150">
      <body
        className={`${m6x11.variable} ${serenityOSEmoji.variable} ${styles.crt} h-screen flex flex-col select-none text-2xl antialiased dark`}
        style={{
          fontFamily: `var(--font-m6x11), system-ui, var(--font-emoji)`,
        }}
      >
        <Analytics />
        <SpeedInsights />
        {/* no hydration error since client does not rerender layout*/}
        <Falling />
        <Settings />
        <Soundtrack />

        {/*  <svg xmlns="http://www.w3.org/2000/svg" height="0" className="absolute">
          <filter
            id="crtWarp"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="userSpaceOnUse"
          >
            <feImage
              href={sphere.src}
              x="-100%"
              y="0"
              width="300%"
              height="100%"
              preserveAspectRatio="none"
              result="disp"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="disp"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>*/}
        <Cursor cursor={icon} />
        <Navbar logo={icon} />
        {children}
      </body>
    </html>
  );
}

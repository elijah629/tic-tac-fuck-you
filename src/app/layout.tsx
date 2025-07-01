import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./crt.module.css";
import { Navbar } from "@/components/navbar";
import TTFUCursor from "@/components/cursor";
import sphere from "@/images/sphere.png";

const m6x11 = localFont({
  src: "./m6x11plus.ttf",
  variable: "--font-m6x11",
  adjustFontFallback: false,
});

const serenityOSEmoji = localFont({
  src: "./SerenityOS-Emoji.ttf",
  variable: "--font-emoji",
});

export const metadata: Metadata = {
  title: "Tic Tac Fuck You",
  description: "Tic Tac Toe + Balatro + AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${m6x11.variable} ${serenityOSEmoji.variable} ${styles.crt} h-screen flex flex-col select-none text-2xl dark antialiased`}
        style={{
          fontFamily: `var(--font-m6x11), system-ui, var(--font-emoji)`,
        }}
      >
        {/*<svg xmlns="http://www.w3.org/2000/svg" height="0" className="absolute">
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
              scale="100"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>*/}
        <TTFUCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import { Navbar } from "@/components/navbar";
import TTFUCursor from "@/components/cursor";

const m6x11 = localFont({
  src: './m6x11plus.ttf',
  variable: '--font-m6x11',
  adjustFontFallback: false,
});

const serenityOSEmoji = localFont({
  src: './SerenityOS-Emoji.ttf',
  variable: '--font-emoji',
})

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
    <html lang="en" className="h-full">
      <body
        className={`${m6x11.variable} ${serenityOSEmoji.variable} crt text-2xl h-full dark antialiased`}
        style={{
          fontFamily: `var(--font-m6x11), system-ui, var(--font-emoji)`
        }}
      >
        <TTFUCursor/>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}

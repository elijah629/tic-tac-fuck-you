import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

const m6x11 = localFont({
  src: './m6x11plus.ttf',
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
    <html lang="en">
      <body
        className={`${m6x11.className} text-2xl antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import GoatCounter from "@/components/GoatCounter";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhilterSoup | Sanjay Das",
  description: "Music Composition, Production & Creative Coding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} font-sans antialiased bg-black text-white selection:bg-pink-500 selection:text-white`}
      >
        <Navigation />
        {children}
        <GoatCounter />
        <Script
          data-goatcounter="https://philtersoup.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

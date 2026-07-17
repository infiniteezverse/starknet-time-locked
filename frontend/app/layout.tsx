'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarknetConfig, braavos, argentWebWallet, publicProvider } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Starknet Time-Locked Countdown",
  description: "Blockchain-verified countdown timer on Starknet",
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
      <body className="min-h-full flex flex-col bg-slate-950">
        <StarknetConfig
          chains={[sepolia]}
          provider={publicProvider()}
          connectors={[braavos(), argentWebWallet()]}
        >
          {children}
        </StarknetConfig>
      </body>
    </html>
  );
}

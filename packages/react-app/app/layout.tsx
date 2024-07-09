import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

import { BlockchainProviders } from "@/providers/blockchain-providers";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiniStore",
  description: "E-Commerce store on MiniPay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} mx-auto p-2 max-w-sm`}>
        <BlockchainProviders>
          <Header />
          {children}
          <Toaster />
        </BlockchainProviders>
      </body>
    </html>
  );
}

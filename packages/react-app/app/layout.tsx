import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

import { BlockchainProviders } from "@/providers/blockchain-providers";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

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
      <body className={`${urbanist.className} mx-auto max-w-sm p-4`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BlockchainProviders>
            <Header />
            {children}
            <Toaster />
          </BlockchainProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}

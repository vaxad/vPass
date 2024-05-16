import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"
import StateComponent from "@/utils/context/StateComponent";
import AuthChecker from "@/components/AuthChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "vPass",
  description: "V just pass your passwords",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex bg-zinc-950 flex-col"}>
        <Toaster />
        <StateComponent>
          <AuthChecker/>
          <Navbar />
          {children}
        </StateComponent>
      </body>
    </html>
  );
}

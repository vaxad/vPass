import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"
import StateComponent from "@/utils/context/StateComponent";
import AuthChecker from "@/components/AuthChecker";

const inter = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "vPass",
  description: "V just pass your passwords",
  keywords: ["password", "manager", "vpass", "vaxad", "v-pass", "vpass vaxad", "Vpass"],
  applicationName: "vPass",
  authors: { name: "vaxad", url: "https://github.com/vaxad" },
  category: "password manager",
  creator: "vaxad",
  publisher: "vaxad"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className + " min-h-screen flex bg-gradient-to-br from-[#060A13] to-[#000000] flex-col"}>
        <Toaster />
        <StateComponent>
          <AuthChecker />
          <Navbar />
          {children}
        </StateComponent>
      </body>
    </html>
  );
}

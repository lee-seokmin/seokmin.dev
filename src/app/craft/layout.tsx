import type { ReactNode } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft | SEOKMIN.DEV",
  description: "Seokmin's craft",
  icons: {
    icon: "/next.svg",
  },
};

export default function CraftLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="px-3">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
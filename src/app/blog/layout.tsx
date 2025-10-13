import type { ReactNode } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | SEOKMIN.DEV",
  description: "Seokmin's blog",
  icons: {
    icon: "/favicon.png",
  },
};

export default function BlogLayout({
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
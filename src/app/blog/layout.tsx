import type { ReactNode } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BlogLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="px-6">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-lg rounded-full px-3 py-2 z-50 shadow-lg shadow-black/[0.03] border border-border hover:px-6 hover:py-3 transition-all duration-300">
      <ul className="flex justify-center items-center gap-2 md:gap-4 hover:gap-6 transition-all duration-300">
        {["Home", "Blog", "Craft"].map((item, idx) => {
          const lowerCaseItem = item.toLowerCase();
          const href = item === "Home" ? "/" : `/${lowerCaseItem}`;
          const isActive = item === "Home" ? pathname === "/" : pathname.startsWith(`/${lowerCaseItem}`);
          return (
            <Link
              key={idx}
              href={href}
              className={`relative px-2 py-1 transition-all duration-300 rounded-xl hover:bg-foreground/10 hover:px-2.5 hover:py-1.5 md:hover:px-3 md:hover:py-1 ${isActive ? "text-chart-2" : "text-foreground hover:text-chart-2"}`}
            >
              <span className="text-sm font-bold">
                {item}
              </span>
            </Link>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl cursor-pointer"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </ul>
    </nav>
  );
}
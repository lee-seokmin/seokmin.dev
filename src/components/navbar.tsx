"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import TableOfContents from "@/components/blog/TableOfContents";
import { toast } from "sonner";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-lg rounded-full px-3 py-2 z-50 shadow-lg shadow-black/[0.03] border border-border hover:px-6 hover:py-2.5 transition-all duration-300">
      <ul className="flex justify-center items-center gap-2 md:gap-4 hover:gap-7 transition-all duration-300">
        {pathname.startsWith("/blog/") && (
          <TableOfContents />
        )}
        {["Home", "Blog", "Craft"].map((item, idx) => {
          const lowerCaseItem = item.toLowerCase();
          const href = item === "Home" ? "/" : `/${lowerCaseItem}`;
          const isActive = item === "Home" ? pathname === "/" : pathname.startsWith(`/${lowerCaseItem}`);
          return (
            <Link
              key={idx}
              href={href}
              className={`relative px-4 py-1 transition-all duration-300 rounded-lg hover:bg-foreground/10 ${isActive ? "text-chart-2" : "text-foreground hover:text-chart-2"}`}
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
          onClick={() => {
            const themes = ["light", "dark"];
            const currentResolvedTheme = resolvedTheme || "light";
            const currentIndex = themes.indexOf(currentResolvedTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];

            setTheme(nextTheme);
            toast.success("Theme changed to " + nextTheme);
          }}
          className="rounded-full border-2 border-border hover:border-primary/50 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </ul>
    </nav>
  );
}
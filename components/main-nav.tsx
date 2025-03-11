"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "next-themes";

export function MainNav() {
  const pathname = usePathname();

  const { theme } = useTheme(); // Get the current theme

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Image
          src={
            theme === "dark"
              ? "/logo.png"
              : "/logo.png"
          }
          alt="logo"
          width={30}
          height={30}
        />
      </Link>
      <nav className="flex items-center gap-4 text-primary text-sm lg:gap-6">
        {siteConfig.mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href
                ? "text-foreground font-semibold"
                : "text-primary/60"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

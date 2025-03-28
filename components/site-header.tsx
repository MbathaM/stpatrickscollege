import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { AuthLinks } from "./auth-links";
import { ThemeSelector } from "@/components/themes-selector";

export function SiteHeader() {
  return (
    <header className="sticky top-0 pt-4 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex gap-2 items-center">
            <ThemeSelector />
            <ModeSwitcher />
            <AuthLinks />
          </nav>
        </div>
      </div>
    </header>
  );
}

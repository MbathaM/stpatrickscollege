import { siteConfig } from "@/config/site";
import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 shrink-0 px-4 md:px-6">
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
        {/* Centered paragraph */}
        <p className="text-sm text-muted-foreground text-left flex-1">
          &copy; {currentYear}{" "}
          <span className="text-primary hover:underline">
            <Link
              href="https://www.spckokstad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"

          >
            {siteConfig.name}
            </Link>
          </span>
          . All Rights Reserved.
        </p>


        {/* Right-aligned paragraph */}
        <p className="text-sm  text-muted-foreground text-right">
          Designed by{" "}
          <Link
            href={siteConfig.author.url}
            target="_blank" // Opens link in a new tab
            rel="noopener noreferrer" // Recommended for security with target="_blank"
            className="text-primary hover:underline"
          >
            {siteConfig.author.name}
          </Link>
        </p>
      </div>
    </footer>
  );
}

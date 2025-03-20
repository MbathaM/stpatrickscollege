import { fonts } from "@/config/fonts";
import { META_THEME_COLORS, siteConfig } from "@/config/site";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/providers/convex-client";
import { Providers } from "@/providers/theme";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark", META_THEME_COLORS)}
    >
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fonts.sans,
          fonts.mono
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ConvexClientProvider>
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              {children}
            </ActiveThemeProvider>
          </ConvexClientProvider>
        </Providers>
      </body>
    </html>
  );
}

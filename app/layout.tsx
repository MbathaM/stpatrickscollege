import { fonts } from "@/config/fonts";
import { META_THEME_COLORS, siteConfig } from "@/config/site";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/providers/convex-client";
import { Providers } from "@/providers/theme";

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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark", META_THEME_COLORS)}
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fonts.sans,
          fonts.mono
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </Providers>
      </body>
    </html>
  );
}

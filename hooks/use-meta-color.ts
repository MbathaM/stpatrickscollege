import { META_THEME_COLORS } from "@/config/site";
import { useTheme } from "next-themes";
import * as React from "react";

/**
 * Hook to manage the `meta[name="theme-color"]` value dynamically based on theme.
 */
export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  // Directly compute meta color instead of using useMemo
  const metaColor =
    resolvedTheme !== "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark;

  // Function to update the meta tag
  const setMetaColor = React.useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, []);

  // Automatically update the meta tag when theme changes
  React.useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  return {
    metaColor,
    setMetaColor, // Exposed for manual override if needed
  };
}

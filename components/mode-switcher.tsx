"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = React.useCallback(() => {
    const isDark = resolvedTheme === "dark";
    setTheme(isDark ? "light" : "dark");
    setMetaColor(isDark ? META_THEME_COLORS.light : META_THEME_COLORS.dark);
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-transparent"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{resolvedTheme === "dark" ? "light" : "dark"} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}

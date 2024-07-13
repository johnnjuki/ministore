import { motion } from "framer-motion";
import { Monitor, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useIsMounted } from "@/hooks/use-is-mounted";

const THEMES_TYPE = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
};

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  return (
    <div className="flex items-center gap-x-1 rounded-full bg-muted p-1">
      <button
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground"
        onClick={() => setTheme(THEMES_TYPE.LIGHT)}
      >
        {isMounted && theme === THEMES_TYPE.LIGHT && (
          <motion.div
            className="absolute inset-0 rounded-full bg-background mix-blend-color-burn"
            layoutId="selected-theme"
          />
        )}
        <Sun className="h-5 w-5" />
      </button>

      <button
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground"
        onClick={() => setTheme(THEMES_TYPE.DARK)}
      >
        {isMounted && theme === THEMES_TYPE.DARK && (
          <motion.div
            className="absolute inset-0 rounded-full bg-background mix-blend-exclusion"
            layoutId="selected-theme"
          />
        )}

        <MoonStar className="h-5 w-5" />
      </button>

      <button
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground"
        onClick={() => setTheme(THEMES_TYPE.SYSTEM)}
      >
        {isMounted && theme === THEMES_TYPE.SYSTEM && (
          <motion.div
            className="absolute inset-0 rounded-full bg-background mix-blend-exclusion"
            layoutId="selected-theme"
          />
        )}
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
};

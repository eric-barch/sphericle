import { Button } from "@/components/ui/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSwitch = ({ isStuck }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleClick = () => {
    switch (resolvedTheme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("light");
        break;
      default:
        setTheme("system");
    }
  };

  return (
    <Button
      className={`h-full px-4 mr-4 rounded-full ${!isStuck ? "ml-auto" : ""}`}
      onClick={handleClick}
    >
      <Sun data-hide-on-theme="light" />
      <Moon data-hide-on-theme="dark" />
    </Button>
  );
};

export { ThemeSwitch };

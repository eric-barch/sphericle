import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";

type ThemeSwitchProps = HTMLAttributes<HTMLButtonElement>;

const ThemeSwitch = (props: ThemeSwitchProps) => {
  const { className } = props;

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
      className={cn("h-full px-4 mr-4 rounded-full", className)}
      onClick={handleClick}
    >
      <Sun data-hide-on-theme="light" />
      <Moon data-hide-on-theme="dark" />
    </Button>
  );
};

export { ThemeSwitch };

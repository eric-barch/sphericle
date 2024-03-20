"use client";

import { cn } from "@/lib/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/providers/dark-mode-provider";
import { Logo } from "@/components/logo";

const Nav = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isStuck, setIsStuck] = useState(false);

  const handleClick = () => {
    console.log("click");
    toggleDarkMode();
  };

  const navRootRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRootRef.current) {
        const navTop = navRootRef.current.getBoundingClientRect().top;
        setIsStuck(navTop <= 0);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("Nav isDark", isDarkMode);
  }, [isDarkMode]);

  return (
    <NavigationMenu.Root
      ref={navRootRef}
      className="flex sticky -top-0 z-50 h-16 w-screen items-center border-t-2 border-b-2 border-black bg-white dark:bg-gray-3"
      orientation="horizontal"
    >
      {isStuck && (
        <NavigationMenu.Item
          className="flex h-full w-40 items-center ml-4 px-4 rounded-full"
          asChild
        >
          <Link href="/">
            <Logo className="h-full w-full" />
          </Link>
        </NavigationMenu.Item>
      )}
      <NavigationMenu.Item
        className={cn(
          "flex h-full items-center ml-4 px-4 rounded-full",
          isStuck && "ml-auto",
        )}
        asChild
      >
        <Link href="/browse-quizzes">Browse Quizzes</Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item
        className="flex h-full items-center px-4 rounded-full"
        asChild
      >
        <Link href="/build-quiz">Build a Quiz</Link>
      </NavigationMenu.Item>
      <Button
        className={cn("h-full px-4 mr-4 rounded-full", !isStuck && "ml-auto")}
        onClick={handleClick}
      >
        {isDarkMode ? <Sun /> : <Moon />}
      </Button>
      <NavigationMenu.Item
        className="flex bg-black text-white items-center h-full px-8"
        asChild
      >
        <Link href="/login">Login</Link>
      </NavigationMenu.Item>
    </NavigationMenu.Root>
  );
};

export { Nav };

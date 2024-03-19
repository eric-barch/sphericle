"use client";

import { cn } from "@/lib/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode.hook";

const Nav = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [isStuck, setIsStuck] = useState(false);

  const handleClick = () => {
    setIsDark(!isDark);
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

  return (
    <NavigationMenu.Root
      ref={navRootRef}
      className="flex sticky -top-0 z-50 h-16 w-screen items-center border-t-2 border-b-2 border-black bg-white dark:bg-gray-2"
      orientation="horizontal"
    >
      {isStuck && (
        <NavigationMenu.Item
          className="flex h-full items-center ml-4 px-4 rounded-full"
          asChild
        >
          <Link href="/">
            <Image
              priority
              src="/sphericle-americas.svg"
              alt="Sphericle Americas Logo"
              width={100}
              height={25}
            />
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
        {isDark ? <Sun /> : <Moon />}
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

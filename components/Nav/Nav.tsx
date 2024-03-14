"use client";

import { cn } from "@/lib/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Nav = () => {
  const [isStuck, setIsStuck] = useState(false);

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
      className="flex sticky -top-0 z-50 h-16 items-center border-t-2 border-b-2 border-black bg-white"
      orientation="horizontal"
    >
      {isStuck && (
        <NavigationMenu.Item className="flex h-full items-center px-8" asChild>
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
          "flex h-full items-center pl-8 pr-4",
          isStuck && "ml-auto",
        )}
        asChild
      >
        <Link href="/browse-quizzes">Browse Quizzes</Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item
        className="flex h-full items-center pl-4 pr-8"
        asChild
      >
        <Link href="/build-quiz">Build a Quiz</Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item
        className={cn(
          "flex h-full items-center px-8 bg-black text-white",
          !isStuck && "ml-auto",
        )}
        asChild
      >
        <Link href="/login">Login</Link>
      </NavigationMenu.Item>
    </NavigationMenu.Root>
  );
};

export { Nav };

/**Radix components require client rendering */
"use client";

import { Logo } from "@/components/logo";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ComponentProps } from "react";
import { ThemeSwitch } from "./theme-switch";

type StickyNavProps = ComponentProps<"nav">;

const StickyNav = (props: StickyNavProps) => {
  const { children } = props;

  return (
    <NavigationMenu.Root
      className="flex sticky -top-0 z-50 h-16 w-screen items-center border-t-2 border-b-2 border-black bg-white dark:bg-gray-2"
      orientation="horizontal"
    >
      <NavigationMenu.Item
        className="flex h-full w-40 items-center ml-4 px-4 rounded-full"
        asChild
      >
        <Link href="/">
          <Logo className="h-full w-full" />
        </Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item
        className="flex h-full items-center px-4 rounded-full ml-auto"
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
      <ThemeSwitch className="ml-4" />
      <NavigationMenu.Item className="flex bg-black text-white items-center h-full px-8">
        {children}
      </NavigationMenu.Item>
    </NavigationMenu.Root>
  );
};

export { StickyNav };

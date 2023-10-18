"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export default function NavBar() {
  return (
    <NavigationMenu.Root className="top-navigation" orientation="horizontal">
      <NavigationMenu.List className="flex flex-row justify-between">
        <NavigationMenu.Item>
          <Link href="/">globle</Link>
        </NavigationMenu.Item>
        <div className="flex flex-row space-x-3">
          <NavigationMenu.Item>
            <Link href="/build-quiz">Build Quiz</Link>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

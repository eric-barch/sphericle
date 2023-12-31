"use client";

import { navHeight } from "@/constants";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export default function Nav() {
  return (
    <NavigationMenu.Root
      className={`sticky top-0 z-50 w-screen p-3 bg-gray-900 h-[calc(${navHeight}rem)]`}
      orientation="horizontal"
    >
      <NavigationMenu.List className="flex flex-row justify-between">
        <NavigationMenu.Item className="rounded-2xl">
          <Link className="p-1.5 rounded-2xl" href="/">
            Sphericle
          </Link>
        </NavigationMenu.Item>
        <div className="flex flex-row space-x-3">
          <NavigationMenu.Item>
            <Link className="p-1.5 rounded-2xl" href="/build-quiz">
              Build Quiz
            </Link>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

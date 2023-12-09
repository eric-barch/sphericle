"use client";

import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { navHeight } from "@/constants";

export default function Nav() {
  return (
    <NavigationMenu.Root
      className={`sticky top-0 z-50 w-screen p-3 bg-gray-900`}
      style={{ height: `${navHeight}rem` }}
      orientation="horizontal"
    >
      <NavigationMenu.List className="flex flex-row justify-between">
        <NavigationMenu.Item className="rounded-3xl">
          <Link className="p-1.5 rounded-3xl" href="/">
            Sphericle
          </Link>
        </NavigationMenu.Item>
        <div className="flex flex-row space-x-3">
          <NavigationMenu.Item>
            <Link className="p-1.5 rounded-3xl" href="/build-quiz">
              Build Quiz
            </Link>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

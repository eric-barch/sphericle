"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <NavigationMenu.Root
      className={`flex items-center sticky top-0 z-50 w-screen px-6 py-3 bg-gray-900 h-16`}
      orientation="horizontal"
    >
      <div className="grow">
        <NavigationMenu.List className="flex flex-row items-center justify-between">
          <NavigationMenu.Item>
            <Link className="rounded-2xl" href="/">
              <Image
                className="pt-0.5"
                src="/sphericle-americas.svg"
                alt="Sphericle Logo"
                width={150}
                height={150}
              />
            </Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <Link className="rounded-3xl p-2" href="/build-quiz">
              Build Quiz
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </div>
    </NavigationMenu.Root>
  );
}

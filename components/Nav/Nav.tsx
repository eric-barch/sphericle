"use client";

import { cn } from "@/lib/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";

type NavProps = {
  stuck: boolean;
};

const Nav = (props: NavProps) => {
  const { stuck } = props;

  return (
    <NavigationMenu.Root
      className={cn(
        "flex items-center justify-between z-50 w-full px-12 py-3 bg-white border-b-2 border-black h-16",
        stuck ? "sticky top-0" : "border-t-2",
      )}
      orientation="horizontal"
    >
      <div className="flex grow items-center">
        {stuck && (
          <NavigationMenu.Item asChild>
            <Link className="rounded-3xl p-1.5 mr-4" href="/">
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
        <NavigationMenu.List className="flex flex-row items-stretch">
          <NavigationMenu.Item>
            <Link className="rounded-3xl pr-4" href="/browse-quizzes">
              Browse Quizzes
            </Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <Link className="rounded-3xl px-4" href="/build-quiz">
              Build a Quiz
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </div>
      <NavigationMenu.Item asChild>
        <Link className="rounded-3xl pl-4" href="/login">
          Login
        </Link>
      </NavigationMenu.Item>
    </NavigationMenu.Root>
  );
};

export { Nav };

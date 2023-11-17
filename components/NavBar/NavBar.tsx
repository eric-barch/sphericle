import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

interface NavBarProps {
  navBarHeight: number;
}

export default function NavBar({ navBarHeight }: NavBarProps) {
  return (
    <div style={{ height: `${navBarHeight}px` }}>
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
    </div>
  );
}

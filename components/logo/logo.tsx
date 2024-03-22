"use client";

import { LogoForeground } from "./logo-foreground";
import { LogoBackground } from "./logo-background";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <div className={cn("relative", className)}>
      <LogoForeground className="z-10" />
      <LogoBackground />
    </div>
  );
};

export { Logo };

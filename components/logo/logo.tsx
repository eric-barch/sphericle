"use client";

import { Land } from "./land";
import { LogoBackground } from "./logo-background";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <div className={cn("relative", className)}>
      <Land className="z-10" />
      <LogoBackground />
    </div>
  );
};

export { Logo };

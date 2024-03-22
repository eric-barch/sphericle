"use client";

import Image from "next/image";

type LogoForegroundProps = {
  className?: string;
};

const LogoForeground = (props: LogoForegroundProps) => {
  const { className } = props;

  return (
    <Image
      priority
      fill
      className={className}
      src="/sphericle-americas.svg"
      alt="americas"
      loading="eager"
    />
  );
};

export { LogoForeground };

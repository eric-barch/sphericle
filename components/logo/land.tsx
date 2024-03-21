"use client";

import Image from "next/image";

type LandProps = {
  className?: string;
};

const Land = (props: LandProps) => {
  const { className } = props;

  return (
    <Image
      priority
      fill
      className={className}
      src="/americas.svg"
      alt="americas"
      loading="eager"
    />
  );
};

export { Land };

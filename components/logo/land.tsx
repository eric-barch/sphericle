"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

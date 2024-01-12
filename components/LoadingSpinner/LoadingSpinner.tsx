import Image from "next/image";
import { useState } from "react";

interface LoadingSpinnerProps {
  className?: string;
}

const images = [
  "/sphere-americas.svg",
  "/sphere-africa.svg",
  "/sphere-europe.svg",
  "/sphere-asia.svg",
];

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  const [imageSrc] = useState<string>(
    images[Math.floor(Math.random() * images.length)],
  );

  return (
    <div
      className={`${className} flex h-full w-full justify-center items-center`}
    >
      <Image
        priority
        className="animate-spin-slow"
        src={imageSrc}
        alt="Loading globe"
        width={200}
        height={200}
      />
    </div>
  );
}

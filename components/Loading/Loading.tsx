import Image from "next/image";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div
      className={`${className} flex h-full w-full absolute left-0 right-0 top-0 z-40 justify-center items-center`}
    >
      <Image
        priority
        className="animate-spin-slow"
        src="/sphere-americas.svg"
        alt="Loading globe"
        width={200}
        height={200}
      />
    </div>
  );
}

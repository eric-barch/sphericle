import Image from "next/image";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={`${className} flex h-full w-full justify-center items-center`}
    >
      <Image
        priority
        className="animate-spin-slow"
        src={"/sphere-americas.svg"}
        alt="Loading globe"
        width={200}
        height={200}
      />
    </div>
  );
}

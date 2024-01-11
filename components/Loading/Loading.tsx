import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <Image
        className="animate-spin-slow"
        src="/sphere-americas.svg"
        alt="Loading globe"
        width={200}
        height={200}
      />
    </div>
  );
}

import Image from "next/image";

type LoadingSpinnerProps = {
  className?: string;
};

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
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
};

export { LoadingSpinner };

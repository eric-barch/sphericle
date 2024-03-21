import Image from "next/image";

const LogoBackground = () => {
  return (
    <>
      <Image
        priority
        fill
        data-hide-on-theme="dark"
        src="/logo-background-light-mode.svg"
        alt="sphericle logo"
        loading="eager"
      />
      <Image
        priority
        fill
        data-hide-on-theme="light"
        src="/logo-background-dark-mode.svg"
        alt="sphericle logo"
        loading="eager"
      />
    </>
  );
};

export { LogoBackground };

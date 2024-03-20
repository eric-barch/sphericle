import { useDarkMode } from "@/providers/dark-mode-provider";
import Image from "next/image";

const LogoBackground = () => {
  const { isDarkMode } = useDarkMode();

  const imagePath = isDarkMode
    ? "/logo-background-dark-mode.svg"
    : "/logo-background-light-mode.svg";

  return (
    <Image src={imagePath} fill={true} alt="sphericle logo" loading="eager" />
  );
};

export { LogoBackground };

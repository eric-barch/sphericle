import Image from "next/image";
import { useMemo } from "react";

type LandProps = {
  className?: string;
};

const Land = (props: LandProps) => {
  const { className } = props;

  const continents = ["africa", "americas", "asia", "europe"];

  const selectedContinent = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * continents.length);
    return continents[randomIndex];
  }, []);

  const imagePath = `/${selectedContinent}.svg`;

  return (
    <Image
      className={className}
      src={imagePath}
      fill={true}
      alt={selectedContinent}
      loading="eager"
    />
  );
};

export { Land };

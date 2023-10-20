"use client";

import { Combobox } from "@headlessui/react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";
import { LocationType } from "./LocationType";
import { useState } from "react";

interface LocationAdderProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
}

export default function LocationAdder({
  parentLocationType,
  parentLocationName,
}: LocationAdderProps) {
  const [locationAdderLocationType, setLocationAdderLocationType] =
    useState<LocationType>(LocationType.Area);
  // const [areaOptions, setAreaOptions] = useState<AreaState[] | null>(null);
  // const [pointOptions, setPointOptions] = useState<PointState[] | null>(null);

  async function searchAreas(input: string) {
    // setAreaOptions(null);

    const url = `/api/search-areas?query=${input}`;
    const response = await fetch(url);
    const responseData = await response.json();

    console.log("responseData:");
    console.log(responseData);
    // const areaOptions = convertResponseDataToAreaOptions(responseData);

    // setAreaOptions(areaOptions);
  }

  function searchPoints(input: string) {}

  return (
    <Combobox>
      <LocationAdderInput
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        searchAreas={searchAreas}
        searchPoints={searchPoints}
      />
      <LocationAdderOptions />
    </Combobox>
  );
}

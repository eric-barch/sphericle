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

  function searchOpenStreetMap(input: string) {}

  function searchGooglePlaces(input: string) {}

  return (
    <Combobox>
      <LocationAdderInput
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        searchOpenStreetMap={searchOpenStreetMap}
        searchGooglePlaces={searchGooglePlaces}
      />
      <LocationAdderOptions />
    </Combobox>
  );
}

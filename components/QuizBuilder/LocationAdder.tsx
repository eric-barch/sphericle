"use client";

import useAreaSearch from "@/hooks/use-area-search.hook";
import usePointSearch from "@/hooks/use-point-search.hook";
import { LocationType } from "@/types";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";

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
  const [input, setInput] = useState<string>("");
  const { searchResults: areaSearchResults, setSearchTerm: setAreaSearchTerm } =
    useAreaSearch();
  const {
    searchResults: pointSearchResults,
    setSearchTerm: setPointSearchTerm,
  } = usePointSearch();

  return (
    <Combobox>
      <LocationAdderInput
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        input={input}
        setInput={setInput}
        setAreaSearchTerm={setAreaSearchTerm}
        areaSearchResults={areaSearchResults}
        setPointSearchTerm={setPointSearchTerm}
      />
      <LocationAdderOptions
        locationAdderLocationType={locationAdderLocationType}
        input={input}
        areaSearchResults={areaSearchResults}
        pointSearchResults={pointSearchResults}
      />
    </Combobox>
  );
}

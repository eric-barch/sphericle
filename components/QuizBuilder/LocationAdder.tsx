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
  const {
    searchTerm: areaSearchTerm,
    searchStatus: areaSearchStatus,
    searchResults: areaSearchResults,
    setSearchTerm: setAreaSearchTerm,
  } = useAreaSearch();
  const {
    searchTerm: pointSearchTerm,
    searchStatus: pointSearchStatus,
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
        areaSearchTerm={areaSearchTerm}
        setAreaSearchTerm={setAreaSearchTerm}
        pointSearchTerm={pointSearchTerm}
        setPointSearchTerm={setPointSearchTerm}
      />
      <LocationAdderOptions
        locationAdderLocationType={locationAdderLocationType}
        input={input}
        areaSearchTerm={areaSearchTerm}
        areaSearchStatus={areaSearchStatus}
        areaSearchResults={areaSearchResults}
        pointSearchTerm={pointSearchTerm}
        pointSearchStatus={pointSearchStatus}
        pointSearchResults={pointSearchResults}
      />
    </Combobox>
  );
}

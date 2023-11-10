"use client";

import useAreaSearch from "@/hooks/use-area-search.hook";
import usePointSearch from "@/hooks/use-point-search.hook";
import { LocationType } from "@/types";
import { Combobox } from "@headlessui/react";
import React, { useState } from "react";
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
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
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

  function onFocus(event: React.FocusEvent) {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (currentTarget.contains(relatedTarget as Node)) {
      event.preventDefault();
    } else {
      setOptionsVisible(true);
    }
  }

  function onBlur(event: React.FocusEvent) {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (currentTarget.contains(relatedTarget as Node)) {
      event.preventDefault();
    } else {
      setOptionsVisible(false);
    }
  }

  return (
    <div onFocus={onFocus} onBlur={onBlur}>
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
          visible={optionsVisible}
          areaSearchTerm={areaSearchTerm}
          areaSearchStatus={areaSearchStatus}
          areaSearchResults={areaSearchResults}
          pointSearchTerm={pointSearchTerm}
          pointSearchStatus={pointSearchStatus}
          pointSearchResults={pointSearchResults}
        />
      </Combobox>
    </div>
  );
}

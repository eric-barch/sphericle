"use client";

import useAreaSearch from "@/hooks/use-area-search.hook";
import usePointSearch from "@/hooks/use-point-search.hook";
import { AreaState, LocationType, PointState, TreeState } from "@/types";
import { Combobox } from "@headlessui/react";
import React, { useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";

interface LocationAdderProps {
  parentLocation: TreeState | AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    childLocation: AreaState | PointState,
  ) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function LocationAdder({
  parentLocation,
  addLocation,
  setFocusedLocation,
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
    reset: resetAreaSearch,
  } = useAreaSearch(parentLocation);
  const {
    searchTerm: pointSearchTerm,
    searchStatus: pointSearchStatus,
    searchResults: pointSearchResults,
    setSearchTerm: setPointSearchTerm,
    reset: resetPointSearch,
  } = usePointSearch(parentLocation);

  function handleFocus(event: React.FocusEvent) {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (currentTarget.contains(relatedTarget as Node)) {
      event.preventDefault();
    } else {
      setOptionsVisible(true);
    }
  }

  function handleBlur(event: React.FocusEvent) {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (currentTarget.contains(relatedTarget as Node)) {
      event.preventDefault();
    } else {
      setOptionsVisible(false);
    }
  }

  function handleChange(location: AreaState | PointState) {
    const newLocation = {
      ...location,
      parent: parentLocation,
    };

    addLocation(parentLocation, newLocation);

    setInput("");
    resetAreaSearch();
    resetPointSearch();
  }

  return (
    <div onFocus={handleFocus} onBlur={handleBlur}>
      <Combobox onChange={handleChange}>
        {({ activeOption }) => (
          <>
            <LocationAdderInput
              parentLocation={parentLocation}
              locationAdderLocationType={locationAdderLocationType}
              setLocationAdderLocationType={setLocationAdderLocationType}
              input={input}
              setInput={setInput}
              areaSearchTerm={areaSearchTerm}
              setAreaSearchTerm={setAreaSearchTerm}
              pointSearchTerm={pointSearchTerm}
              setPointSearchTerm={setPointSearchTerm}
              setFocusedLocation={setFocusedLocation}
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
              activeOption={activeOption}
              setFocusedLocation={setFocusedLocation}
            />
          </>
        )}
      </Combobox>
    </div>
  );
}

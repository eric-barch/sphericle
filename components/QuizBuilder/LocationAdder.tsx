"use client";

import useAreaSearch from "@/hooks/use-area-search.hook";
import usePointSearch from "@/hooks/use-point-search.hook";
import { AreaState, LocationType, PointState, QuizState } from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";

interface LocationAdderProps {
  parentState: QuizState | AreaState;
  addLocation: (
    parent: QuizState | AreaState,
    location: AreaState | PointState,
  ) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function LocationAdder({
  parentState,
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
  } = useAreaSearch(parentState);
  const {
    searchTerm: pointSearchTerm,
    searchStatus: pointSearchStatus,
    searchResults: pointSearchResults,
    setSearchTerm: setPointSearchTerm,
    reset: resetPointSearch,
  } = usePointSearch(parentState);

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (parentState.locationType === LocationType.Area) {
      setFocusedLocation(parentState);
    } else {
      setFocusedLocation(null);
    }

    if (currentTarget.contains(relatedTarget as Node)) {
      event.preventDefault();
    } else {
      setOptionsVisible(true);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
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
      parent: parentState,
    };

    addLocation(parentState, newLocation);

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
              parentLocation={parentState}
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
              activeOption={activeOption}
              setFocusedLocation={setFocusedLocation}
            />
          </>
        )}
      </Combobox>
    </div>
  );
}

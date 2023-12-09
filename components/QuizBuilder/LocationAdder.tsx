"use client";

import { useQuiz } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  RootState,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import useAreaSearch, { AreaSearch } from "./use-area-search.hook";
import usePointSearch, { PointSearch } from "./use-point-search.hook";
import LocationAdderInput from "./LocationAdderInput";
import { LocationAdderOptions } from "./LocationAdderOptions";

interface LocationAdderProps {
  parentId: string;
  isAdding: boolean;
}

export default function LocationAdder({
  parentId,
  isAdding,
}: LocationAdderProps) {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId] as RootState | AreaState;

  const areaSearch = useAreaSearch(parentId);
  const pointSearch = usePointSearch(parentId);

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.AREA,
  );
  const [input, setInput] = useState<string>("");
  const [optionSelected, setOptionSelected] = useState<boolean>(false);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(true);
    }
  }

  function handleChange() {}

  if (!isAdding && parentLocation.sublocationIds.length > 0) {
    return null;
  }

  return (
    <div className="relative" onBlur={handleBlur} onFocus={handleFocus}>
      <Combobox onChange={handleChange}>
        <LocationAdderInput
          parentId={parentId}
          input={input}
          locationType={locationType}
          areaSearch={areaSearch}
          pointSearch={pointSearch}
          setInput={setInput}
          setLocationType={setLocationType}
        />
        <LocationAdderOptions
          parentId={parentId}
          input={input}
          locationType={locationType}
          areaSearch={areaSearch}
          pointSearch={pointSearch}
          locationAdderFocused={isFocused}
        />
      </Combobox>
    </div>
  );
}

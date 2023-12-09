"use client";

import { useQuiz } from "@/components/QuizProvider";
import { AreaState, LocationType, RootState } from "@/types";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import useAreaSearch from "./use-area-search.hook";

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

  if (!isAdding && parentLocation.sublocationIds.length > 0) {
    return null;
  }

  return (
    <div className="relative">
      <Combobox onChange={handleChange}>
        {({ activeOption }) => (
          <>
            <Input
              locationId={locationId}
              input={input}
              locationType={locationType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              inputRef={inputRef}
              setInput={setInput}
              setLocationType={setLocationType}
            />
            <Options
              parentLocationId={locationId}
              activeOption={activeOption}
              input={input}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              locationType={locationType}
              locationAdderFocused={isFocused}
            />
          </>
        )}
      </Combobox>
    </div>
  );
}

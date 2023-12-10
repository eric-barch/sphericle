"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  QuizDispatchType,
  RootState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import { LocationAdderOptions } from "./LocationAdderOptions";
import useAreaSearch from "./use-area-search.hook";
import usePointSearch from "./use-point-search.hook";

interface LocationAdderProps {
  parentId: string;
}

export default function LocationAdder({ parentId }: LocationAdderProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

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

  function handleChange(sublocation: AreaState | PointState) {
    quizDispatch({
      type: QuizDispatchType.ADD_SUBLOCATION,
      parentId,
      sublocation,
    });
  }

  if (!parentLocation.isAdding && parentLocation.sublocationIds.length > 0) {
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

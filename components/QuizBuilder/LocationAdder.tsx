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
import { FocusEvent, RefObject, useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import { LocationAdderOptions } from "./LocationAdderOptions";
import useAreaSearch from "./use-area-search.hook";
import usePointSearch from "./use-point-search.hook";

interface LocationAdderProps {
  inputRef?: RefObject<HTMLInputElement>;
  parentId: string;
}

export default function LocationAdder({
  inputRef,
  parentId,
}: LocationAdderProps) {
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

  function handleFocus(event: FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(true);

      if (!optionSelected) {
        if (parentLocation.locationType === LocationType.ROOT) {
          quizDispatch({
            type: QuizDispatchType.SET_BUILDER_SELECTED,
            locationId: null,
          });
        } else if (parentLocation.locationType === LocationType.AREA) {
          quizDispatch({
            type: QuizDispatchType.SET_BUILDER_SELECTED,
            locationId: parentId,
          });
        }
      }
    } else {
      setOptionSelected(false);
    }
  }

  function handleChange(sublocation: AreaState | PointState) {
    quizDispatch({
      type: QuizDispatchType.ADD_SUBLOCATION,
      parentId,
      sublocation,
    });

    if (inputRef) {
      inputRef.current.value = "";
    }

    setOptionSelected(true);
    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  if (!parentLocation.isAdding && parentLocation.sublocationIds.length > 0) {
    return null;
  }

  return (
    <div className="relative" onBlur={handleBlur} onFocus={handleFocus}>
      <Combobox onChange={handleChange}>
        <LocationAdderInput
          inputRef={inputRef}
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

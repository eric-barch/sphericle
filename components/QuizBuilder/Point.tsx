"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { LocationType, PointState, QuizDispatchType } from "@/types";
import { FocusEvent, useRef, useState } from "react";
import LocationName from "./LocationName";
import EditLocationButton from "./EditLocationButton";

interface PointProps {
  locationId: string;
}

export default function Point({ locationId }: PointProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const location = quiz.locations[locationId] as PointState;

  if (location.locationType !== LocationType.POINT) {
    throw new Error("pointState must be of type POINT.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      quizDispatch({
        type: QuizDispatchType.SET_BUILDER_SELECTED,
        locationId,
      });
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef?.current.focus();
        locationNameInputRef?.current.select();
      }, 0);
    }
  }

  return (
    <div className="relative" onFocus={handleFocus}>
      <EditLocationButton
        locationId={locationId}
        setIsRenaming={setIsRenaming}
      />
      <button
        className={`w-full p-1 rounded-2xl text-left bg-gray-600 ${
          locationId === quiz.selected
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
      >
        <LocationName
          locationId={locationId}
          inputRef={locationNameInputRef}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </button>
    </div>
  );
}

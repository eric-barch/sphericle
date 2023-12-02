import { PointState, QuizDispatchType } from "@/types";
import { FocusEvent, useRef, useState } from "react";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { useQuiz, useQuizDispatch } from "../QuizProvider";

interface PointProps {
  pointState: PointState;
}

export default function Point({ pointState }: PointProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const locationNameInputRef = useRef<HTMLInputElement>();

  function setIsRenaming(isRenaming: boolean) {
    quizDispatch({
      type: QuizDispatchType.SetIsRenaming,
      location: pointState,
      isRenaming,
    });

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    quizDispatch({
      type: QuizDispatchType.Selected,
      location: pointState,
    });
  }

  return (
    <div
      className={`relative w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer ${
        quiz.selectedSublocation?.id === pointState.id
          ? "outline outline-2 outline-red-600"
          : ""
      }`}
      tabIndex={0}
      onFocusCapture={handleFocusCapture}
    >
      <EditLocationButton
        className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
        location={pointState}
        setIsRenaming={setIsRenaming}
      />
      <LocationName
        location={pointState}
        inputRef={locationNameInputRef}
        setIsRenaming={setIsRenaming}
      />
    </div>
  );
}

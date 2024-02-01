"use client";

import { PointState, QuizBuilderStateDispatchType } from "@/types";
import { FocusEvent } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface PointProps {
  pointState: PointState;
}

export default function Point({ pointState }: PointProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: pointState,
      });
    }
  }

  return (
    <div className="relative" onFocus={handleFocus}>
      <EditFeatureButton featureState={pointState} />
      <div
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600 ${
          pointState.featureId === quizBuilderState.selectedFeatureId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
        tabIndex={0}
      >
        <FeatureName featureState={pointState} />
      </div>
    </div>
  );
}

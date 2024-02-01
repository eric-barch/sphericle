"use client";

import { PointState, QuizBuilderStateDispatchType } from "@/types";
import { MouseEvent } from "react";
import { Button } from "../ui/button";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface PointProps {
  pointState: PointState;
}

export default function Point({ pointState }: PointProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
      featureState: pointState,
    });
  }

  return (
    <div className="relative">
      <EditFeatureButton featureId={pointState} />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600 ${
          pointState.featureId === quizBuilderState.selectedFeatureId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
        onClick={handleClick}
      >
        <FeatureName featureState={pointState} />
      </Button>
    </div>
  );
}

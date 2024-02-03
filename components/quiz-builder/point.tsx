"use client";

import { Button } from "@/components/ui/button";
import { PointState, QuizBuilderStateDispatchType } from "@/types";
import { MouseEvent, useCallback, useRef } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface PointProps {
  pointState: PointState;
}

export default function Point({ pointState }: PointProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const featureNameInputRef = useRef<HTMLInputElement>();

  const isRenaming =
    quizBuilderState.renamingFeatureId === pointState.featureId;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: pointState,
      });
    },
    [pointState, quizBuilderStateDispatch],
  );

  return (
    <div className="relative">
      <EditFeatureButton
        featureId={pointState.featureId}
        featureNameInputRef={featureNameInputRef}
      />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600 ${
          pointState.featureId === quizBuilderState.selectedFeatureId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
        onClick={handleClick}
      >
        <FeatureName
          featureId={pointState.featureId}
          featureName={pointState.userDefinedName || pointState.shortName}
          isRenaming={isRenaming}
          featureNameInputRef={featureNameInputRef}
        />
      </Button>
    </div>
  );
}

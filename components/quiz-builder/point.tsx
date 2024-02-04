"use client";

import { Button } from "@/components/ui/button";
import { PointState, QuizBuilderStateDispatchType } from "@/types";
import { MouseEvent, useRef } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface PointProps {
  pointState: PointState;
}

export default function Point({ pointState }: PointProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const featureNameInputRef = useRef<HTMLInputElement>();

  const featureId = pointState.featureId;
  const featureName = pointState.userDefinedName || pointState.shortName;
  const isSelected = quizBuilderState.selectedFeatureId === featureId;
  const isRenaming = quizBuilderState.renamingFeatureId === featureId;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: pointState,
      });
    }
  };

  return (
    <div className="relative">
      <EditFeatureButton
        featureNameInputRef={featureNameInputRef}
        featureId={featureId}
      />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600 ${
          featureId === quizBuilderState.selectedFeatureId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
        onClick={handleClick}
      >
        <FeatureName
          featureNameInputRef={featureNameInputRef}
          featureId={featureId}
          featureName={featureName}
          isRenaming={isRenaming}
        />
      </Button>
    </div>
  );
}

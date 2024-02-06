"use client";

import { Button } from "@/components/ui/button";
import { PointState, QuizBuilderStateDispatchType } from "@/types";
import { MouseEvent, useRef } from "react";
import { EditFeatureButton } from "./edit-feature-button";
import { FeatureName } from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface PointProps {
  pointState: PointState;
}

function Point({ pointState }: PointProps) {
  const { featureId, userDefinedName, shortName } = pointState;

  const {
    quizBuilderState: { selectedFeatureId, renamingFeatureId },
    quizBuilderStateDispatch,
  } = useQuizBuilderState();

  const featureName = userDefinedName || shortName;
  const isSelected = featureId === selectedFeatureId;
  const isRenaming = featureId === renamingFeatureId;

  const featureNameInputRef = useRef<HTMLInputElement>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId,
      });
    }
  };

  return (
    <div className="relative">
      <EditFeatureButton
        featureNameInputRef={featureNameInputRef}
        featureId={featureId}
        isSelected={isSelected}
        isRenaming={isRenaming}
      />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600 ${
          isSelected ? "outline outline-2 outline-red-700" : ""
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

export { Point };

"use client";

import { Button } from "@/components/ui/button";
import { useQuizBuilder } from "@/providers";
import { PointState, QuizBuilderDispatchType } from "@/types";
import { MouseEvent, useRef } from "react";
import { EditFeatureButton } from "./edit-feature-button";
import { FeatureName } from "./feature-name";

type PointProps = {
  point: PointState;
};

const Point = (props: PointProps) => {
  const { point } = props;

  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

  const name = point.userDefinedName || point.shortName;
  const isSelected = point.id === quizBuilder.selectedId;
  const isRenaming = point.id === quizBuilder.renamingId;

  const nameInputRef = useRef<HTMLInputElement>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: point.id,
      });
    }
  };

  return (
    <div className="relative">
      <EditFeatureButton
        nameInputRef={nameInputRef}
        featureId={point.id}
        isSelected={isSelected}
        isRenaming={isRenaming}
      />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600${
          isSelected && " outline outline-2 outline-red-700"
        }`}
        onClick={handleClick}
      >
        <FeatureName
          featureId={point.id}
          name={name}
          isRenaming={isRenaming}
          nameInputRef={nameInputRef}
        />
      </Button>
    </div>
  );
};

export { Point };

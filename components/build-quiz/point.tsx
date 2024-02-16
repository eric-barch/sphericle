"use client";

import { Button } from "@/components/ui/button";
import { useQuizBuilder } from "@/providers";
import { PointState, QuizBuilderDispatchType } from "@/types";
import { MouseEvent, useRef } from "react";
import { MenuButton } from "./edit-feature-button";
import { Name } from "./feature-name";

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
      <MenuButton
        nameRef={nameInputRef}
        featureId={point.id}
        isSelected={isSelected}
        isRenaming={isRenaming}
      />
      <Button
        className={`w-full p-1 cursor-pointer rounded-2xl text-left bg-gray-600${
          isSelected ? " outline outline-2 outline-red-700" : ""
        }`}
        onClick={handleClick}
      >
        <Name
          featureId={point.id}
          name={name}
          isRenaming={isRenaming}
          inputRef={nameInputRef}
        />
      </Button>
    </div>
  );
};

export { Point };

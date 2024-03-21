"use client";

import { Button } from "@/components/ui/button";
import { useQuizBuilder } from "@/providers";
import { PointState, QuizBuilderDispatchType } from "@/types";
import { useRef } from "react";
import { MenuButton } from "./menu-button";
import { Name } from "./name";
import { cn } from "@/lib/utils";

type PointProps = {
  point: PointState;
};

const Point = (props: PointProps) => {
  const { point } = props;

  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

  const name = point.userDefinedName || point.shortName;
  const isSelected = point.id === quizBuilder.selectedId;
  const isRenaming = point.id === quizBuilder.renamingId;

  const nameRef = useRef<HTMLInputElement>();

  const handleClick = () => {
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
        nameRef={nameRef}
        feature={point}
        isSelected={isSelected}
        isRenaming={isRenaming}
      />
      <Button
        className={cn(
          "w-full p-1 bg-gray-6 border-[calc(1px)] border-black rounded-3xl text-left",
          isSelected &&
            "border-red-1 outline outline-[calc(1px)] outline-red-1",
        )}
        onClick={handleClick}
      >
        <Name
          featureId={point.id}
          name={name}
          isRenaming={isRenaming}
          inputRef={nameRef}
        />
      </Button>
    </div>
  );
};

export { Point };

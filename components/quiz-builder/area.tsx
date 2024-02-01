"use client";

import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { MouseEvent, useCallback } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import Subfeatures from "./subfeatures";

interface AreaProps {
  areaState: AreaState;
}

export default function Area({ areaState }: AreaProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureState: areaState,
        isOpen: open,
      });
    },
    [areaState, quizBuilderStateDispatch],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: areaState,
      });

      // If Area is not already selected, prevent toggling Collapsible on first click.
      if (areaState.featureId !== quizBuilderState.selectedFeatureId) {
        event.preventDefault();
      }
    },
    [areaState, quizBuilderState, quizBuilderStateDispatch],
  );

  return (
    <Collapsible.Root
      className="relative"
      open={quizBuilderState.openFeatureIds.has(areaState.featureId)}
      onOpenChange={handleOpenChange}
    >
      <div className="relative">
        <EditFeatureButton featureState={areaState} />
        <Collapsible.Trigger
          className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
            areaState.featureId === quizBuilderState.selectedFeatureId
              ? "outline outline-2 outline-red-700"
              : ""
          }`}
          onClick={handleClick}
        >
          <FeatureName featureState={areaState} />
          <OpenChevron
            isOpen={quizBuilderState.openFeatureIds.has(areaState.featureId)}
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <Subfeatures className="ml-10" parentFeatureState={areaState} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

interface OpenChevronProps {
  isOpen: boolean;
}

function OpenChevron({ isOpen }: OpenChevronProps) {
  return (
    <div className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl right-1">
      <ChevronRight className={`${isOpen ? "rotate-90" : ""} w-6 h-6`} />
    </div>
  );
}

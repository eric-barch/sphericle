"use client";

import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
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

  const handleValueChange = useCallback(
    (value: string[]) => {
      if (value.includes(areaState.featureId)) {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
          featureState: areaState,
          isOpen: true,
        });
      } else {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
          featureState: areaState,
          isOpen: false,
        });
      }
    },
    [areaState, quizBuilderStateDispatch],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: areaState,
      });

      if (areaState.featureId !== quizBuilderState.selectedFeatureId) {
        event.preventDefault();
      }
    },
    [areaState, quizBuilderState.selectedFeatureId, quizBuilderStateDispatch],
  );

  return (
    <Accordion.Root
      type="multiple"
      value={Array.from(quizBuilderState.openFeatureIds)}
      onValueChange={handleValueChange}
    >
      <Accordion.Item value={areaState.featureId}>
        <Accordion.Header className="relative">
          <EditFeatureButton featureState={areaState} />
          <Accordion.Trigger
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
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Subfeatures className="ml-10" parentFeatureState={areaState} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
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

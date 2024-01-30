"use client";

import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { FocusEvent, MouseEvent, useCallback, useState } from "react";
import EditFeatureButton from "./EditFeatureButton";
import FeatureName from "./FeatureName";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import Subfeatures from "./Subfeatures";

interface AreaProps {
  areaState: AreaState;
}

export default function Area({ areaState }: AreaProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  // TODO: Hacky. Fix.
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false);
  const [toggleOnNextClick, setToggleOnNextClick] = useState<boolean>(true);

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

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setToggleOnNextClick(false);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      if (
        mouseIsDown &&
        areaState.featureId !== quizBuilderState.selectedFeatureId
      ) {
        setToggleOnNextClick(false);
      } else {
        setToggleOnNextClick(true);
      }

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: areaState,
      });
    },
    [
      areaState,
      quizBuilderState.selectedFeatureId,
      quizBuilderStateDispatch,
      mouseIsDown,
    ],
  );

  const handleMouseDown = useCallback(() => {
    setMouseIsDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouseIsDown(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseIsDown(false);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (
        areaState.featureId !== quizBuilderState.selectedFeatureId ||
        !toggleOnNextClick
      ) {
        event.preventDefault();
      }

      setToggleOnNextClick(true);
    },
    [areaState, quizBuilderState.selectedFeatureId, toggleOnNextClick],
  );

  return (
    <Accordion.Root
      type="multiple"
      value={Array.from(quizBuilderState.openFeatureIds)}
      onValueChange={handleValueChange}
    >
      <Accordion.Item value={areaState.featureId}>
        <Accordion.Header
          className="relative"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
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

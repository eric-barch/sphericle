"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { isAreaState } from "@/helpers/feature-type-guards";
import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import {
  FocusEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import EditFeatureButton from "./EditFeatureButton";
import FeatureName from "./FeatureName";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import Subfeatures from "./Subfeatures";

interface AreaProps {
  featureId: string;
}

export default function Area({ featureId }: AreaProps) {
  const { allFeatures } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const [areaState, setAreaState] = useState<AreaState>(() => {
    const initialAreaState = allFeatures.get(featureId);

    if (!initialAreaState || !isAreaState(initialAreaState)) {
      throw new Error("initialAreaState must be an AreaState.");
    }

    return initialAreaState;
  });
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false);
  const [toggleOnNextClick, setToggleOnNextClick] = useState<boolean>(true);

  const handleValueChange = useCallback(
    (value: string[]) => {
      if (value.includes(areaState.id)) {
        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_FEATURE_IS_OPEN,
          featureId: areaState.id,
          isOpen: true,
        });
      } else {
        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_FEATURE_IS_OPEN,
          featureId: areaState.id,
          isOpen: false,
        });
      }
    },
    [areaState, quizBuilderStateDispatch],
  );

  const handleContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (
        event.currentTarget.contains(event.relatedTarget) ||
        areaState.subfeatureIds.size <= 0
      ) {
        return;
      }

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING,
        featureId: areaState.id,
        isAdding: false,
      });
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

      if (mouseIsDown && areaState.id !== quizBuilderState.selectedFeatureId) {
        setToggleOnNextClick(false);
      } else {
        setToggleOnNextClick(true);
      }

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
        selectedFeatureId: areaState.id,
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
        areaState.id !== quizBuilderState.selectedFeatureId ||
        !toggleOnNextClick
      ) {
        event.preventDefault();
      }

      setToggleOnNextClick(true);
    },
    [areaState, quizBuilderState.selectedFeatureId, toggleOnNextClick],
  );

  useEffect(() => {
    const areaState = allFeatures.get(featureId);

    if (!areaState || !isAreaState(areaState)) {
      return;
    }

    setAreaState(areaState);
  }, [allFeatures, featureId]);

  return (
    <Accordion.Root
      type="multiple"
      value={Array.from(quizBuilderState.openFeatures)}
      onValueChange={handleValueChange}
      onBlur={handleContainerBlur}
    >
      <Accordion.Item value={areaState.id}>
        <Accordion.Header
          className="relative"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <EditFeatureButton featureId={areaState.id} />
          <Accordion.Trigger
            className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
              areaState.id === quizBuilderState.selectedFeatureId
                ? "outline outline-2 outline-red-700"
                : ""
            }`}
            onClick={handleClick}
          >
            <FeatureName featureId={areaState.id} />
            <OpenChevron
              isOpen={quizBuilderState.openFeatures.has(areaState.id)}
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Subfeatures className="ml-10" parentFeatureId={areaState.id} />
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

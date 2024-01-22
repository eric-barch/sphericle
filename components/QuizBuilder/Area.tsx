"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { isAreaState } from "@/helpers/feature-type-guards";
import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import EditFeatureButton from "./EditFeatureButton";
import FeatureName from "./FeatureName";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import Subfeatures from "./Subfeatures";

interface AreaProps {
  featureId: string;
}

export default function Area({ featureId }: AreaProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const initialAreaState = allFeatures.get(featureId);

  if (!isAreaState(initialAreaState)) {
    throw new Error("initialAreaState must be an AreaState.");
  }

  const [areaState, setAreaState] = useState<AreaState>(initialAreaState);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const featureNameInputRef = useRef<HTMLInputElement>();
  const featureAdderInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const areaState = allFeatures.get(featureId);

    if (!areaState || !isAreaState(areaState)) {
      return;
    }

    setAreaState(areaState);
  }, [allFeatures, featureId]);

  function handleValueChange(value: string[]) {
    if (value.includes(featureId)) {
      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_AREA_IS_OPEN,
        featureId,
        isOpen: true,
      });
    } else {
      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_AREA_IS_OPEN,
        featureId,
        isOpen: false,
      });
    }
  }

  function handleContainerBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsAdding(false);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setWillToggle(false);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      if (mouseDown) {
        setWillToggle(false);
      } else {
        setWillToggle(true);
      }

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
        selectedFeatureId: featureId,
      });
    }
  }

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(true);
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(false);
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(false);
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        featureNameInputRef?.current.focus();
        featureNameInputRef?.current.select();
      }, 0);
    }
  }

  function setIsAdding(isAdding: boolean) {
    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_AREA_IS_ADDING,
      featureId,
      isAdding,
    });

    if (isAdding) {
      setTimeout(() => {
        featureAdderInputRef?.current.focus();
      }, 0);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (featureId !== quizBuilderState.selectedFeatureId || !willToggle) {
      event.preventDefault();
    }

    setWillToggle(true);
  }

  return (
    <Accordion.Root
      type="multiple"
      value={Array.from(quizBuilderState.openAreas)}
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
          <EditFeatureButton
            featureId={featureId}
            setIsRenaming={setIsRenaming}
            setIsAdding={setIsAdding}
          />
          <Accordion.Trigger
            className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
              featureId === quizBuilderState.selectedFeatureId
                ? "outline outline-2 outline-red-700"
                : ""
            }`}
            onClick={handleClick}
          >
            <FeatureName
              featureId={featureId}
              inputRef={featureNameInputRef}
              isRenaming={isRenaming}
              setIsRenaming={setIsRenaming}
            />
            <OpenChevron isOpen={quizBuilderState.openAreas.has(featureId)} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Subfeatures
            featureAdderInputRef={featureAdderInputRef}
            className="ml-10"
            parentFeatureId={featureId}
          />
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

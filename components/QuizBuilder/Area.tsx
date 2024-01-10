"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  AllFeaturesDispatchType,
  FeatureType,
  QuizBuilderDispatchType,
} from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import EditLocationButton from "./EditFeatureButton";
import LocationName from "./FeatureName";
import { useQuizBuilder, useQuizBuilderDispatch } from "./QuizBuilderProvider";
import Subfeatures from "./Subfeatures";

interface AreaProps {
  featureId: string;
}

export default function Area({ featureId }: AreaProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();

  const quizBuilder = useQuizBuilder();
  const quizBuilderDispatch = useQuizBuilderDispatch();

  const areaState = allFeatures.get(featureId);

  if (areaState.featureType !== FeatureType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  const [accordionRootValue, setAccordionRootValue] = useState<string[]>(
    areaState.isOpen ? [areaState.id] : [],
  );
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const featureNameInputRef = useRef<HTMLInputElement>();
  const featureAdderInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setAccordionRootValue(areaState.isOpen ? [featureId] : []);
  }, [areaState.isOpen, featureId]);

  function handleValueChange(value: string[]) {
    if (value.includes(featureId)) {
      allFeaturesDispatch({
        type: AllFeaturesDispatchType.SET_AREA_IS_OPEN,
        featureId: featureId,
        isOpen: true,
      });
    } else {
      allFeaturesDispatch({
        type: AllFeaturesDispatchType.SET_AREA_IS_OPEN,
        featureId: featureId,
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

      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: featureId,
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
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.SET_AREA_IS_ADDING,
      featureId: featureId,
      isAdding,
    });

    if (isAdding) {
      setTimeout(() => {
        featureAdderInputRef?.current.focus();
      }, 0);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (featureId !== quizBuilder.selectedId || !willToggle) {
      event.preventDefault();
    }

    setWillToggle(true);
  }

  return (
    <Accordion.Root
      type="multiple"
      value={accordionRootValue}
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
          <EditLocationButton
            featureId={featureId}
            setIsRenaming={setIsRenaming}
            setIsAdding={setIsAdding}
          />
          <Accordion.Trigger
            className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
              featureId === quizBuilder.selectedId
                ? "outline outline-2 outline-red-700"
                : ""
            }`}
            onClick={handleClick}
          >
            <LocationName
              featureId={featureId}
              inputRef={featureNameInputRef}
              isRenaming={isRenaming}
              setIsRenaming={setIsRenaming}
            />
            <OpenChevron isOpen={areaState.isOpen} />
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

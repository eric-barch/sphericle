"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  FeatureType,
  QuizBuilderDispatchType,
  AllFeaturesDispatchType,
} from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import Sublocations from "./Sublocations";
import { ChevronRight } from "lucide-react";
import { useQuizBuilder, useQuizBuilderDispatch } from "./QuizBuilderProvider";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const quizBuilder = useQuizBuilder();
  const quizBuilderDispatch = useQuizBuilderDispatch();

  const location = quiz[locationId] as AreaState;

  if (location.featureType !== FeatureType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  const [accordionRootValue, setAccordionRootValue] = useState<string[]>(
    location.isOpen ? [location.id] : [],
  );
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();
  const locationAdderInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setAccordionRootValue(location.isOpen ? [locationId] : []);
  }, [location.isOpen, locationId]);

  function handleValueChange(value: string[]) {
    if (value.includes(locationId)) {
      quizDispatch({
        type: AllFeaturesDispatchType.SET_AREA_IS_OPEN,
        featureId: locationId,
        isOpen: true,
      });
    } else {
      quizDispatch({
        type: AllFeaturesDispatchType.SET_AREA_IS_OPEN,
        featureId: locationId,
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
        type: QuizBuilderDispatchType.SET_SELECTED_FEATURE,
        featureId: locationId,
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
        locationNameInputRef?.current.focus();
        locationNameInputRef?.current.select();
      }, 0);
    }
  }

  function setIsAdding(isAdding: boolean) {
    quizDispatch({
      type: AllFeaturesDispatchType.SET_AREA_IS_ADDING,
      featureId: locationId,
      isAdding,
    });

    if (isAdding) {
      setTimeout(() => {
        locationAdderInputRef?.current.focus();
      }, 0);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (locationId !== quizBuilder.selectedId || !willToggle) {
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
      <Accordion.Item value={location.id}>
        <Accordion.Header
          className="relative"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <EditLocationButton
            locationId={locationId}
            setIsRenaming={setIsRenaming}
            setIsAdding={setIsAdding}
          />
          <Accordion.Trigger
            className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
              locationId === quizBuilder.selectedId
                ? "outline outline-2 outline-red-700"
                : ""
            }`}
            onClick={handleClick}
          >
            <LocationName
              locationId={locationId}
              inputRef={locationNameInputRef}
              isRenaming={isRenaming}
              setIsRenaming={setIsRenaming}
            />
            <OpenChevron isOpen={location.isOpen} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Sublocations
            locationAdderInputRef={locationAdderInputRef}
            className="ml-10"
            parentId={locationId}
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

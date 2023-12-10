import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, QuizDispatchType } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import Sublocations from "./Sublocations";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const location = quiz.locations[locationId] as AreaState;

  if (location.locationType !== LocationType.AREA) {
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
        type: QuizDispatchType.SET_AREA_IS_OPEN,
        locationId,
        isOpen: true,
      });
    } else {
      quizDispatch({
        type: QuizDispatchType.SET_AREA_IS_OPEN,
        locationId,
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

      quizDispatch({
        type: QuizDispatchType.SET_BUILDER_SELECTED,
        locationId,
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
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function setIsAdding(isAdding: boolean) {
    quizDispatch({
      type: QuizDispatchType.SET_AREA_IS_ADDING,
      locationId,
      isAdding,
    });

    if (isAdding) {
      setTimeout(() => {
        locationAdderInputRef.current.focus();
      }, 0);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (locationId !== quiz.selectedBuilderLocationId || !willToggle) {
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
            id="disclosure-button"
            className={`w-full p-1 bg-gray-600 rounded-3xl text-left cursor-pointer ${
              locationId === quiz.selectedBuilderLocationId
                ? "outline outline-2 outline-red-700"
                : ""
            }`}
            onClick={handleClick}
          >
            <LocationName
              inputRef={locationNameInputRef}
              locationId={locationId}
              isRenaming={isRenaming}
              setIsRenaming={setIsRenaming}
            />
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

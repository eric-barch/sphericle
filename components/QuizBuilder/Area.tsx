import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, QuizDispatchType } from "@/types";
import Sublocations from "./Sublocations";
import EditLocationButton from "./EditLocationButton";
import { FocusEvent, useRef, useState } from "react";
import LocationName from "./LocationName";
import * as Accordion from "@radix-ui/react-accordion";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const areaState = quiz.locations[locationId] as AreaState;

  if (areaState.locationType !== LocationType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();
  const locationAdderInputRef = useRef<HTMLInputElement>();

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
      type: QuizDispatchType.SET_LOCATION_IS_ADDING,
      locationId,
      isAdding,
    });

    if (isAdding) {
      setTimeout(() => {
        locationAdderInputRef.current.focus();
      }, 0);
    }
  }

  function handleContainerBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsAdding(false);
    }
  }

  return (
    <Accordion.Root type="multiple" onBlur={handleContainerBlur}>
      <Accordion.Item value={areaState.id}>
        <Accordion.Header className="relative">
          <EditLocationButton
            locationId={locationId}
            setIsRenaming={setIsRenaming}
            setIsAdding={setIsAdding}
          />
          <Accordion.Trigger
            id="disclosure-button"
            className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600`}
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

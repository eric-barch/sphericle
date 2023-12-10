import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, QuizDispatchType } from "@/types";
import Sublocations from "./Sublocations";
import EditLocationButton from "./EditLocationButton";
import { useRef, useState } from "react";
import LocationName from "./LocationName";

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
      });
    }
  }

  return (
    <>
      <div className="relative">
        <EditLocationButton
          locationId={locationId}
          setIsRenaming={setIsRenaming}
          setIsAdding={setIsAdding}
        />
        <div
          id="disclosure-button"
          className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600`}
        >
          <LocationName
            inputRef={locationNameInputRef}
            locationId={locationId}
            isRenaming={isRenaming}
            setIsRenaming={setIsRenaming}
          />
        </div>
      </div>
      <Sublocations
        locationAdderInputRef={locationAdderInputRef}
        className="ml-10"
        parentId={locationId}
      />
    </>
  );
}

import { useQuiz } from "@/components/QuizProvider";
import { AreaState, LocationType } from "@/types";
import Sublocations from "./Sublocations";
import EditLocationButton from "./EditLocationButton";
import { useRef, useState } from "react";
import LocationName from "./LocationName";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const areaState = quiz.locations[locationId] as AreaState;

  if (areaState.locationType !== LocationType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  return (
    <>
      <div className="relative">
        <EditLocationButton
          locationId={locationId}
          setIsRenaming={setIsRenaming}
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
      <Sublocations className="ml-10" parentId={locationId} />
    </>
  );
}

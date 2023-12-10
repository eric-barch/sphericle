import { useQuiz } from "@/components/QuizProvider";
import { AreaState, LocationType } from "@/types";
import Sublocations from "./Sublocations";
import EditLocationButton from "./EditLocationButton";
import { useState } from "react";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const areaState = quiz.locations[locationId] as AreaState;

  if (areaState.locationType !== LocationType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  const [isRenaming, setIsRenaming] = useState<boolean>(false);

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
          <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
            {areaState.shortName}
          </div>
        </div>
      </div>
      <Sublocations className="ml-10" parentId={locationId} />
    </>
  );
}

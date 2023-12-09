import { useQuiz } from "@/components/QuizProvider";
import { AreaState, LocationType } from "@/types";
import Sublocations from "./Sublocations";

interface AreaProps {
  locationId: string;
}

export default function Area({ locationId }: AreaProps) {
  const quiz = useQuiz();
  const areaState = quiz.locations[locationId] as AreaState;

  if (areaState.locationType !== LocationType.AREA) {
    throw new Error("areaState must be of type AREA.");
  }

  return (
    <>
      <div
        className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 outline outline-2 outline-red-600`}
      >
        {areaState.shortName}
      </div>
      <Sublocations className="ml-10" parentId={locationId} />
    </>
  );
}

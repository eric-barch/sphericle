import { useQuiz } from "@/components/QuizProvider";
import { LocationType, PointState } from "@/types";

interface PointProps {
  locationId: string;
}

export default function Point({ locationId }: PointProps) {
  const quiz = useQuiz();
  const pointState = quiz.locations[locationId] as PointState;

  if (pointState.locationType !== LocationType.POINT) {
    throw new Error("pointState must be of type POINT.");
  }

  return (
    <div
      className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 outline outline-2 outline-red-600`}
    >
      {pointState.shortName}
    </div>
  );
}

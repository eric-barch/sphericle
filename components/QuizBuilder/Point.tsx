import { AreaState, PointState, QuizState } from "@/types";
import { FaEllipsisVertical, FaLocationDot } from "react-icons/fa6";

interface PointProps {
  location: PointState;
  deleteLocation: (targetLocation: PointState) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function Point({
  location,
  deleteLocation,
  setFocusedLocation,
}: PointProps) {
  function handleFocus() {
    setFocusedLocation(location);
  }

  return (
    <div
      className="relative w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer"
      tabIndex={0}
      onFocus={handleFocus}
    >
      <div className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1">
        <FaEllipsisVertical className="text-gray-400" />
      </div>
      <span>{location.fullName}</span>
    </div>
  );
}

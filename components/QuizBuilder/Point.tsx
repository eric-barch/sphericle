import { AreaState, PointState, TreeState } from "@/types";
import { FaLocationDot } from "react-icons/fa6";

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
      className="relative quiz-builder-item quiz-builder-location cursor-pointer"
      tabIndex={0}
      onFocus={handleFocus}
    >
      <div className="quiz-builder-item-decorator-left-1">
        <FaLocationDot className="text-gray-400" />
      </div>
      <span>{location.fullName}</span>
    </div>
  );
}

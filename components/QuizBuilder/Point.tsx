import { Coordinate, PointState } from "@/types";
import { FaLocationDot } from "react-icons/fa6";

interface PointProps {
  location: PointState;
  deleteLocation: (targetLocation: PointState) => void;
  setMarkers: (markers: Coordinate[]) => void;
}

export default function Point({
  location,
  deleteLocation,
  setMarkers,
}: PointProps) {
  function handleFocus() {
    setMarkers([location.position]);
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

import {
  AreaState,
  Bounds,
  Coordinate,
  LocationType,
  PointState,
  Polygon,
  TreeState,
} from "@/types";
import { FaLocationDot } from "react-icons/fa6";

interface PointProps {
  parentLocation: TreeState | AreaState;
  location: PointState;
  deleteLocation: (targetLocation: PointState) => void;
  setMarkers: (markers: Coordinate[]) => void;
  setParentPolygons: (polygons: Polygon[]) => void;
  setChildPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

export default function Point({
  parentLocation,
  location,
  deleteLocation,
  setMarkers,
  setParentPolygons,
  setChildPolygons,
  setBounds,
}: PointProps) {
  function handleFocus() {
    if (parentLocation.locationType === LocationType.Tree) {
      const lat = location.position.lat;
      const lng = location.position.lng;
      const diff = 0.01;

      const bounds = {
        north: lat + diff,
        south: lat - diff,
        east: lng + diff,
        west: lng - diff,
      };

      setBounds(bounds);
      setParentPolygons([]);
      setChildPolygons([]);
    } else {
      setBounds(parentLocation.bounds);
      setParentPolygons(parentLocation.polygons);
      setChildPolygons([]);
    }

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

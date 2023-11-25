import { AreaState, LocationType, PointState, QuizState } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  className?: string;
  parentLocation: QuizState | AreaState;
  setParentOutlined: (outlined: boolean) => void;
  addLocation: (
    parentLocation: QuizState | AreaState,
    location: AreaState | PointState,
  ) => void;
  deleteLocation: (location: AreaState | PointState) => void;
  renameLocation: (location: AreaState | PointState, name: string) => void;
  toggleLocationOpen: (location: AreaState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export function Sublocations({
  className,
  parentLocation,
  setParentOutlined,
  addLocation,
  deleteLocation,
  renameLocation,
  toggleLocationOpen,
  setDisplayedLocation,
}: SublocationsProps) {
  return (
    <div className={`${className ? className : ""} space-y-1 h-full`}>
      {parentLocation.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              location={sublocation}
              addLocation={addLocation}
              deleteLocation={deleteLocation}
              renameLocation={renameLocation}
              toggleLocationOpen={toggleLocationOpen}
              setDisplayedLocation={setDisplayedLocation}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          return (
            <Point
              key={sublocation.placeId}
              location={sublocation}
              renameLocation={renameLocation}
              deleteLocation={deleteLocation}
              setDisplayedLocation={setDisplayedLocation}
            />
          );
        }

        return null; // return null when no conditions match
      })}
      <LocationAdder
        parentLocation={parentLocation}
        setParentOutlined={setParentOutlined}
        addLocation={addLocation}
        setDisplayedLocation={setDisplayedLocation}
      />
    </div>
  );
}

import { AreaState, LocationType, PointState, QuizState } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface LocationsProps {
  className?: string;
  parentLocation: QuizState | AreaState;
  addLocation: (
    parentLocation: QuizState | AreaState,
    location: AreaState | PointState,
  ) => void;
  deleteLocation: (location: AreaState | PointState) => void;
  renameLocation: (location: AreaState | PointState, name: string) => void;
  toggleLocationOpen: (location: AreaState) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export function Locations({
  className,
  parentLocation,
  addLocation,
  deleteLocation,
  renameLocation,
  toggleLocationOpen,
  setFocusedLocation,
}: LocationsProps) {
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
              setFocusedLocation={setFocusedLocation}
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
              setFocusedLocation={setFocusedLocation}
            />
          );
        }

        return null; // return null when no conditions match
      })}
      <LocationAdder
        parentLocation={parentLocation}
        addLocation={addLocation}
        setFocusedLocation={setFocusedLocation}
      />
    </div>
  );
}

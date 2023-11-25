import { AreaState, LocationType, PointState, Quiz } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  className?: string;
  parentState: Quiz | AreaState;
  addLocation: (
    parentLocation: Quiz | AreaState,
    location: AreaState | PointState,
  ) => void;
  deleteLocation: (location: AreaState | PointState) => void;
  renameLocation: (location: AreaState | PointState, name: string) => void;
  toggleLocationOpen: (location: AreaState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
  setParentOutlined: (outlined: boolean) => void;
}

export function Sublocations({
  className,
  parentState,
  addLocation,
  deleteLocation,
  renameLocation,
  toggleLocationOpen,
  setDisplayedLocation,
  setParentOutlined,
}: SublocationsProps) {
  return (
    <div className={`${className ? className : ""} space-y-1 h-full`}>
      {parentState.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              areaState={sublocation}
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
              pointState={sublocation}
              renameLocation={renameLocation}
              deleteLocation={deleteLocation}
              setDisplayedLocation={setDisplayedLocation}
            />
          );
        }

        return null;
      })}
      <LocationAdder
        parentState={parentState}
        addLocation={addLocation}
        setDisplayedLocation={setDisplayedLocation}
        setParentOutlined={setParentOutlined}
      />
    </div>
  );
}

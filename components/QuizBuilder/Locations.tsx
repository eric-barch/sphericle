import { AreaState, LocationType, PointState, TreeState } from "@/types";
import { CSSProperties } from "react";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface LocationsProps {
  className?: string;
  style?: CSSProperties;
  parentLocation: TreeState | AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export function Locations({
  className,
  style,
  parentLocation,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setFocusedLocation,
}: LocationsProps) {
  return (
    <div className={`${className} space-y-1`} style={style}>
      {parentLocation.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              location={sublocation}
              addLocation={addLocation}
              toggleLocationOpen={toggleLocationOpen}
              deleteLocation={deleteLocation}
              setFocusedLocation={setFocusedLocation}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          return (
            <Point
              key={sublocation.placeId}
              location={sublocation}
              deleteLocation={deleteLocation}
              setFocusedLocation={setFocusedLocation}
            />
          );
        }
      })}
      <LocationAdder
        parentLocation={parentLocation}
        addLocation={addLocation}
        setFocusedLocation={setFocusedLocation}
      />
    </div>
  );
}

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
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export function Locations({
  className,
  style,
  parentLocation,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setDisplayedLocation,
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
              setDisplayedLocation={setDisplayedLocation}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          return (
            <Point
              key={sublocation.placeId}
              location={sublocation}
              deleteLocation={deleteLocation}
              setDisplayedLocation={setDisplayedLocation}
            />
          );
        }
      })}
      <LocationAdder
        parentLocation={parentLocation}
        addLocation={addLocation}
        setDisplayedLocation={setDisplayedLocation}
      />
    </div>
  );
}

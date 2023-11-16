import {
  AreaState,
  LocationType,
  PointState,
  TreeState,
  Coordinate,
  Polygon,
  Bounds,
} from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface LocationsProps {
  className?: string;
  parentLocation: TreeState | AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ) => void;
  setLocationOpen: (targetLocation: AreaState, open: boolean) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export function Locations({
  className,
  parentLocation,
  addLocation,
  setLocationOpen,
  deleteLocation,
  setDisplayedLocation,
}: LocationsProps) {
  return (
    <div className={`${className} space-y-1`}>
      {parentLocation.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              location={sublocation}
              addLocation={addLocation}
              setLocationOpen={setLocationOpen}
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

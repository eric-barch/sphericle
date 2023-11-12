import { AreaState, LocationType, PointState, RootState } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";

interface LocationsProps {
  className?: string;
  parentLocation: RootState | AreaState;
  addLocation: (
    parentLocation: RootState | AreaState,
    childLocation: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
}

export function Locations({
  className,
  parentLocation,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
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
              toggleLocationOpen={toggleLocationOpen}
              deleteLocation={deleteLocation}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          // return Point component
          // Make sure to return a component here
        }
      })}
      <LocationAdder
        parentLocation={parentLocation}
        addLocation={addLocation}
      />
    </div>
  );
}

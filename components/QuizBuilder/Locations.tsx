import { AreaState, LocationType, PointState } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";

interface LocationsProps {
  className?: string;
  parentLocationType: LocationType;
  parentLocationDisplayName: string;
  locations: (AreaState | PointState)[];
}

export function Locations({
  className,
  parentLocationType,
  parentLocationDisplayName,
  locations,
}: LocationsProps) {
  return (
    <div className={`${className} space-y-1`}>
      {locations.map((location) => {
        if (location.locationType === LocationType.Area) {
          return (
            <Area
              key={location.placeId}
              displayName={location.displayName}
              fullName={location.fullName}
              open={location.open}
              sublocations={location.sublocations}
            />
          );
        }

        if (location.locationType === LocationType.Point) {
          // return Point component
          // Make sure to return a component here
        }
      })}
      <LocationAdder
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationDisplayName}
      />
    </div>
  );
}

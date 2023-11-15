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
    childLocation: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setMarkers: (markers: Coordinate[]) => void;
  setPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

export function Locations({
  className,
  parentLocation,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setMarkers,
  setPolygons,
  setBounds,
}: LocationsProps) {
  return (
    <div className={`${className} space-y-1`}>
      {parentLocation.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              parentLocation={parentLocation}
              location={sublocation}
              addLocation={addLocation}
              toggleLocationOpen={toggleLocationOpen}
              deleteLocation={deleteLocation}
              setMarkers={setMarkers}
              setPolygons={setPolygons}
              setBounds={setBounds}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          return (
            <Point
              key={sublocation.placeId}
              parentLocation={parentLocation}
              location={sublocation}
              deleteLocation={deleteLocation}
              setMarkers={setMarkers}
              setPolygons={setPolygons}
              setBounds={setBounds}
            />
          );
        }
      })}
      <LocationAdder
        parentLocation={parentLocation}
        addLocation={addLocation}
        setMarkers={setMarkers}
        setPolygons={setPolygons}
      />
    </div>
  );
}

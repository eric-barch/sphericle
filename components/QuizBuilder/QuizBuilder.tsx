import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import {
  AreaState,
  Coordinate,
  LocationType,
  PointState,
  LocationTree,
  Polygon,
} from "@/types";
import { useEffect, useState } from "react";
import { Locations } from "./Locations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [locationTree, setLocationTree] = useState<LocationTree>({
    locationType: LocationType.Root,
    displayName: "Root",
    sublocations: [],
  });
  const [markers, setMarkers] = useState<Coordinate[]>([]);
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  // TODO: is this a janky way to load Places?
  useEffect(() => {
    async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }
    }

    loadPlacesLibrary();
  }, []);

  function findLocation(
    searchLocation: LocationTree | AreaState | PointState,
    targetLocation: LocationTree | AreaState | PointState,
    newLocation: LocationTree | AreaState | PointState | null,
  ): LocationTree | AreaState | PointState | null {
    if (searchLocation === targetLocation) {
      return newLocation;
    }

    if (searchLocation.locationType === LocationType.Point) {
      return searchLocation;
    }

    if (
      searchLocation.locationType === LocationType.Root ||
      searchLocation.locationType === LocationType.Area
    ) {
      let newSublocations: (AreaState | PointState)[] = [];

      for (const currentSublocation of searchLocation.sublocations) {
        const newSublocation = findLocation(
          currentSublocation,
          targetLocation,
          newLocation,
        );

        if (
          newSublocation?.locationType === LocationType.Area ||
          newSublocation?.locationType === LocationType.Point
        ) {
          newSublocations.push(newSublocation);
        }
      }

      const newSearchLocation = {
        ...searchLocation,
        sublocations: newSublocations,
      };

      return newSearchLocation;
    }

    throw new Error(
      "Could not classify searchLocation as Root, Area, or Point.",
    );
  }

  function replaceLocation(
    targetLocation: LocationTree | AreaState | PointState,
    newLocation: LocationTree | AreaState | PointState | null,
  ): void {
    const newRoot = findLocation(locationTree, targetLocation, newLocation);

    if (newRoot?.locationType !== LocationType.Root) {
      throw new Error("newRoot is not a RootState.");
    }

    setLocationTree(newRoot);
  }

  function addLocation(
    parentLocation: LocationTree | AreaState,
    childLocation: AreaState | PointState,
  ): void {
    const newParentLocation = {
      ...parentLocation,
      sublocations: [...parentLocation.sublocations, childLocation],
    };

    replaceLocation(parentLocation, newParentLocation);
  }

  function toggleLocationOpen(targetLocation: AreaState): void {
    const newLocation = {
      ...targetLocation,
      open: !targetLocation.open,
    };

    replaceLocation(targetLocation, newLocation);
  }

  function deleteLocation(targetLocation: AreaState | PointState): void {
    replaceLocation(targetLocation, null);
  }

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <Locations
            className="m-2"
            parentLocation={locationTree}
            addLocation={addLocation}
            toggleLocationOpen={toggleLocationOpen}
            deleteLocation={deleteLocation}
          />
          <Map
            mapId="696d0ea42431a75c"
            center={{
              lat: 40.69153221695429,
              lng: -73.98506899223159,
            }}
            zoom={8}
            markers={markers}
            polygons={polygons}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}

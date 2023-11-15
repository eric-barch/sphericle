import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import {
  AreaState,
  Coordinate,
  LocationType,
  PointState,
  TreeState,
  Polygon,
  Bounds,
} from "@/types";
import { useEffect, useState } from "react";
import { Locations } from "./Locations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [locationTree, setLocationTree] = useState<TreeState>({
    locationType: LocationType.Tree,
    displayName: "Root",
    sublocations: [],
  });
  const [bounds, setBounds] = useState<Bounds>({
    south: 0,
    north: 0,
    east: 0,
    west: 0,
  });
  const [markers, setMarkers] = useState<Coordinate[]>([]);
  const [parentPolygons, setParentPolygons] = useState<Polygon[]>([]);
  const [childPolygons, setChildPolygons] = useState<Polygon[]>([]);

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
    searchLocation: TreeState | AreaState | PointState,
    targetLocation: TreeState | AreaState | PointState,
    newLocation: TreeState | AreaState | PointState | null,
  ): TreeState | AreaState | PointState | null {
    if (searchLocation === targetLocation) {
      return newLocation;
    }

    if (searchLocation.locationType === LocationType.Point) {
      return searchLocation;
    }

    if (
      searchLocation.locationType === LocationType.Tree ||
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
    targetLocation: TreeState | AreaState | PointState,
    newLocation: TreeState | AreaState | PointState | null,
  ): void {
    const newRoot = findLocation(locationTree, targetLocation, newLocation);

    if (newRoot?.locationType !== LocationType.Tree) {
      throw new Error("newRoot is not a RootState.");
    }

    setLocationTree(newRoot);
  }

  function addLocation(
    parentLocation: TreeState | AreaState,
    childLocation: AreaState | PointState,
  ): void {
    const newParentLocation = {
      ...parentLocation,
      sublocations: [...parentLocation.sublocations, childLocation],
    };

    replaceLocation(parentLocation, newParentLocation);

    if (parentLocation.locationType === LocationType.Tree) {
      setParentPolygons([]);
    } else {
      setBounds(parentLocation.bounds);
      setParentPolygons(parentLocation.polygons);
    }

    if (childLocation.locationType === LocationType.Area) {
      setChildPolygons(childLocation.polygons);
      setMarkers([]);
    } else {
      setChildPolygons([]);
      setMarkers([childLocation.position]);
    }
  }

  function setLocationOpen(targetLocation: AreaState, open: boolean): void {
    const newLocation = {
      ...targetLocation,
      open,
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
            setLocationOpen={setLocationOpen}
            deleteLocation={deleteLocation}
            setMarkers={setMarkers}
            setParentPolygons={setParentPolygons}
            setChildPolygons={setChildPolygons}
            setBounds={setBounds}
          />
          <Map
            mapId="696d0ea42431a75c"
            bounds={bounds}
            markers={markers}
            parentPolygons={parentPolygons}
            childPolygons={childPolygons}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
